// SharePoint Membership Tracker Integration via Microsoft Graph API
// Syncs MSC user data to a SharePoint list using upsert-by-StudentID logic
const axios = require('axios');
const { randomUUID } = require('crypto');
const { getGraphToken, clearTokenCache } = require('../config/sharepoint');
const pool = require('../config/db');

const GRAPH_BASE = 'https://graph.microsoft.com/v1.0';

// ─────────────────────────────────────────────
// In-memory bulk sync job tracker
// ─────────────────────────────────────────────
const jobs = new Map();

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

// Build authenticated Graph API headers (re-uses cached token)
async function getHeaders() {
  const token = await getGraphToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// Read SP_SITE_ID and SP_LIST_ID from environment
function getSPConfig() {
  const siteId = process.env.SP_SITE_ID;
  const listId = process.env.SP_LIST_ID;

  if (!siteId) {
    const err = new Error('SP_SITE_ID is not configured');
    err.code = 'SP_SITE_NOT_FOUND';
    throw err;
  }
  if (!listId) {
    const err = new Error('SP_LIST_ID is not configured');
    err.code = 'SP_LIST_NOT_FOUND';
    throw err;
  }
  return { siteId, listId };
}

// Wrap a Graph API error into a typed SP error
function toSpError(err, fallbackCode = 'SP_SYNC_FAILED') {
  if (err.code && err.code.startsWith('SP_')) return err;

  const status = err.response?.status;
  if (status === 429) {
    const spErr = new Error('Graph API rate limit exceeded');
    spErr.code = 'SP_RATE_LIMITED';
    spErr.retryAfter = parseInt(err.response.headers?.['retry-after'] || '10', 10);
    return spErr;
  }
  if (status === 401 || status === 403) {
    clearTokenCache();
    const spErr = new Error('Graph API authentication failed');
    spErr.code = 'SP_AUTH_FAILED';
    return spErr;
  }
  if (
    status === 400 &&
    err.response?.data?.error?.code === 'invalidRequest'
  ) {
    const spErr = new Error('SharePoint column mismatch — verify list schema matches spec');
    spErr.code = 'SP_COLUMN_MISMATCH';
    return spErr;
  }

  const spErr = new Error(err.message || 'Graph API error');
  spErr.code = fallbackCode;
  spErr.original = err;
  return spErr;
}

// ─────────────────────────────────────────────
// Database helpers
// ─────────────────────────────────────────────

// Fetch a user row plus a comma-separated list of their guild names
async function getUserWithGuilds(userId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT u.*,
              GROUP_CONCAT(g.name ORDER BY g.name SEPARATOR ', ') AS guildNames
       FROM users u
       LEFT JOIN guild_members gm ON u.id = gm.user_id
       LEFT JOIN guilds g         ON gm.guild_id = g.id
       WHERE u.id = ?
       GROUP BY u.id`,
      [userId]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

// Fetch IDs for all active users (used by bulk sync)
async function getAllActiveUserIds() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT id FROM users WHERE isActive = TRUE`
    );
    return rows.map((r) => r.id);
  } finally {
    connection.release();
  }
}

// ─────────────────────────────────────────────
// SharePoint list operations
// ─────────────────────────────────────────────

// Find the first SharePoint list item whose StudentID column matches studentId
async function findSpItem(siteId, listId, studentId, headers) {
  try {
    const res = await axios.get(
      `${GRAPH_BASE}/sites/${siteId}/lists/${listId}/items` +
        `?$filter=fields/StudentID eq '${studentId}'` +
        `&$expand=fields` +
        `&$select=id,fields`,
      { headers }
    );
    return res.data.value?.[0] || null;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw toSpError(err);
  }
}

// Build the SharePoint fields payload from a DB user row
// options.isCreate   → include IsActive = true (new record)
// options.isActive   → explicitly override IsActive (e.g. deactivation)
// options.fields     → array of SP column names to include (partial update)
function buildFields(user, options = {}) {
  const memberSince =
    user.created_at instanceof Date
      ? user.created_at.toISOString()
      : new Date(user.created_at).toISOString();

  const all = {
    StudentID: user.studentId,
    FullName: user.fullName,
    Email: user.email,
    YearLevel: user.yearLevel,
    Course: user.course,
    Role: user.role,
    Guilds: user.guildNames || '',
    MemberSince: memberSince,
    LastSynced: new Date().toISOString(),
  };

  // IsActive: only written explicitly (create or deactivation); SharePoint owns it otherwise
  if (options.isCreate) {
    all.IsActive = true;
  } else if (options.isActive !== undefined) {
    all.IsActive = options.isActive;
  }

  // Partial update — return only the requested columns plus LastSynced
  if (options.fields && options.fields.length > 0) {
    const partial = { LastSynced: all.LastSynced };
    for (const col of options.fields) {
      if (all[col] !== undefined) partial[col] = all[col];
    }
    if (options.isActive !== undefined) partial.IsActive = options.isActive;
    return partial;
  }

  return all;
}

// ─────────────────────────────────────────────
// Core: sync a single user to SharePoint
// Returns { userId, sharePointItemId, action, syncedAt }
// ─────────────────────────────────────────────
async function syncUserToSharePoint(userId, options = {}) {
  const user = await getUserWithGuilds(userId);
  if (!user) {
    const err = new Error(`User ${userId} not found`);
    err.code = 'NOT_FOUND';
    throw err;
  }

  const { siteId, listId } = getSPConfig();
  const headers = await getHeaders();
  const existing = await findSpItem(siteId, listId, user.studentId, headers);

  let sharePointItemId;
  let action;

  try {
    if (existing) {
      const fields = buildFields(user, { ...options, isCreate: false });
      await axios.patch(
        `${GRAPH_BASE}/sites/${siteId}/lists/${listId}/items/${existing.id}/fields`,
        fields,
        { headers }
      );
      sharePointItemId = existing.id;
      action = 'updated';
    } else {
      const fields = buildFields(user, { ...options, isCreate: true });
      const res = await axios.post(
        `${GRAPH_BASE}/sites/${siteId}/lists/${listId}/items`,
        { fields },
        { headers }
      );
      sharePointItemId = res.data.id;
      action = 'created';
    }
  } catch (err) {
    throw toSpError(err);
  }

  return {
    userId: String(userId),
    sharePointItemId: String(sharePointItemId),
    action,
    syncedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────
// Bulk sync: queue all active users, run in background
// ─────────────────────────────────────────────
async function bulkSyncUsers(overwrite = false) {
  const userIds = await getAllActiveUserIds();

  const jobId = randomUUID();
  const job = {
    jobId,
    status: 'pending',
    total: userIds.length,
    processed: 0,
    errors: [],
    completedAt: null,
  };
  jobs.set(jobId, job);

  // Fire and forget — results tracked in the job object
  setImmediate(() => runBulkJob(jobId, userIds, overwrite));

  return { queued: userIds.length, jobId };
}

// Background worker — processes each user sequentially with rate-limit backoff
async function runBulkJob(jobId, userIds, overwrite) {
  const job = jobs.get(jobId);
  if (!job) return;

  job.status = 'running';

  // overwrite: true  → full field set (default upsert behaviour)
  // overwrite: false → same upsert, but does not touch IsActive on existing items
  // Both paths use the same syncUserToSharePoint; the only difference is the
  // intent documented to callers (future: could skip unchanged records when overwrite=false)
  const options = {};

  for (const userId of userIds) {
    try {
      await syncUserToSharePoint(userId, options);
    } catch (err) {
      job.errors.push({ userId: String(userId), message: err.message || 'Sync failed' });

      // Back-off on rate-limit before continuing
      if (err.code === 'SP_RATE_LIMITED') {
        const waitMs = (err.retryAfter || 10) * 1000;
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }
    job.processed++;
  }

  job.status =
    job.errors.length > 0 && job.processed === job.errors.length
      ? 'failed'
      : 'completed';
  job.completedAt = new Date().toISOString();
}

// ─────────────────────────────────────────────
// Job status lookup
// ─────────────────────────────────────────────
function getJobStatus(jobId) {
  return jobs.get(jobId) || null;
}

// ─────────────────────────────────────────────
// SharePoint connectivity status
// ─────────────────────────────────────────────
async function getSharePointStatus() {
  let connected = false;
  let connectError = null;

  try {
    await getGraphToken();
    connected = true;
  } catch (err) {
    connectError = err.code || 'SP_AUTH_FAILED';
  }

  const { siteId, listId } = getSPConfig();
  const hostname = process.env.SP_HOSTNAME || 'your-tenant.sharepoint.com';
  const sitePath = process.env.SP_SITE_PATH || 'sites/MSC';

  let totalSynced = 0;
  let lastSyncAt = null;
  let listUrl = `https://${hostname}/${sitePath}/Lists/${listId}`;

  if (connected) {
    try {
      const headers = await getHeaders();

      // Item count using OData $count
      const countRes = await axios.get(
        `${GRAPH_BASE}/sites/${siteId}/lists/${listId}/items` +
          `?$select=id&$top=1&$count=true`,
        { headers: { ...headers, ConsistencyLevel: 'eventual' } }
      );
      totalSynced = countRes.data['@odata.count'] || 0;

      // Most recently synced item
      const recentRes = await axios.get(
        `${GRAPH_BASE}/sites/${siteId}/lists/${listId}/items` +
          `?$expand=fields($select=LastSynced)` +
          `&$orderby=fields/LastSynced desc&$top=1`,
        { headers }
      );
      lastSyncAt = recentRes.data.value?.[0]?.fields?.LastSynced || null;

      // Canonical list URL from Graph metadata
      const listRes = await axios.get(
        `${GRAPH_BASE}/sites/${siteId}/lists/${listId}?$select=webUrl`,
        { headers }
      );
      listUrl = listRes.data.webUrl || listUrl;
    } catch (err) {
      // Non-fatal — still report connected: true, best-effort metadata
      console.error('[SP_STATUS] Could not fetch list metadata:', err.message);
    }
  }

  return {
    connected,
    error: connectError,
    lastSyncAt,
    totalSynced,
    listUrl,
  };
}

// ─────────────────────────────────────────────
// Fire-and-forget wrapper used by auto-triggers
// Never throws; logs errors to console only
// ─────────────────────────────────────────────
function syncInBackground(userId, options = {}) {
  syncUserToSharePoint(userId, options).catch((err) => {
    console.error(
      `[SP_SYNC] Background sync failed for user ${userId}: [${err.code || 'ERR'}] ${err.message}`
    );
  });
}

module.exports = {
  syncUserToSharePoint,
  bulkSyncUsers,
  getJobStatus,
  getSharePointStatus,
  syncInBackground,
};
