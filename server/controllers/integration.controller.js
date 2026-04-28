const {
  syncUserToSharePoint,
  bulkSyncUsers,
  getJobStatus,
  getSharePointStatus,
} = require('../services/sharepoint.service');

// ─────────────────────────────────────────────
// POST /integrations/sharepoint/sync/:userId
// Manually sync one user to SharePoint (Admin only)
// ─────────────────────────────────────────────
async function syncUserHandler(req, res) {
  try {
    const { userId } = req.params;

    const result = await syncUserToSharePoint(userId);

    res.status(200).json(result);
  } catch (err) {
    if (err.code === 'NOT_FOUND') {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
    }
    const code = err.code?.startsWith('SP_') ? err.code : 'SP_SYNC_FAILED';
    console.error('[INTEGRATION] syncUser error:', err.message);
    res.status(500).json({
      error: { code, message: err.message },
    });
  }
}

// ─────────────────────────────────────────────
// POST /integrations/sharepoint/sync/bulk
// Queue all active users for background sync (Admin only)
// Body: { overwrite?: boolean }
// ─────────────────────────────────────────────
async function bulkSyncHandler(req, res) {
  try {
    const overwrite = req.body?.overwrite === true;

    const result = await bulkSyncUsers(overwrite);

    res.status(200).json(result);
  } catch (err) {
    const code = err.code?.startsWith('SP_') ? err.code : 'SP_SYNC_FAILED';
    console.error('[INTEGRATION] bulkSync error:', err.message);
    res.status(500).json({
      error: { code, message: err.message },
    });
  }
}

// ─────────────────────────────────────────────
// GET /integrations/sharepoint/jobs/:jobId
// Poll the status of a bulk sync job (Admin only)
// ─────────────────────────────────────────────
async function jobStatusHandler(req, res) {
  try {
    const { jobId } = req.params;
    const job = getJobStatus(jobId);

    if (!job) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Job not found' },
      });
    }

    res.status(200).json(job);
  } catch (err) {
    console.error('[INTEGRATION] jobStatus error:', err.message);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: err.message },
    });
  }
}

// ─────────────────────────────────────────────
// GET /integrations/sharepoint/status
// Check SharePoint connectivity & list metadata (Admin only)
// ─────────────────────────────────────────────
async function statusHandler(req, res) {
  try {
    const status = await getSharePointStatus();
    res.status(200).json(status);
  } catch (err) {
    const code = err.code?.startsWith('SP_') ? err.code : 'SP_SYNC_FAILED';
    console.error('[INTEGRATION] status error:', err.message);
    res.status(500).json({
      error: { code, message: err.message },
    });
  }
}

module.exports = {
  syncUserHandler,
  bulkSyncHandler,
  jobStatusHandler,
  statusHandler,
};
