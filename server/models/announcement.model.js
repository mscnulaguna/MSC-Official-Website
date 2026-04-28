// Import database connection pool
const pool = require('../config/db');

// Get paginated list of announcements with optional pinned filter
async function getAllAnnouncements(page = 1, pageSize = 20, filters = {}) {
  const connection = await pool.getConnection();
  try {
    let query = `SELECT a.*, u.fullName as createdByName, g.name as guildName 
                 FROM announcements a
                 LEFT JOIN users u ON a.created_by = u.id
                 LEFT JOIN guilds g ON a.guild_id = g.id
                 WHERE 1=1`;
    const params = [];

    // Filter by pinned announcements only if specified
    if (filters.pinned) {
      query += ` AND a.pinned = true`;
    }

    // Count total announcements
    const [countResult] = await connection.query(
      `SELECT COUNT(*) as total FROM announcements WHERE 1=1${
        filters.pinned ? ' AND pinned = true' : ''
      }`,
      params
    );

    const total = countResult[0].total;

    // Get paginated results, pinned first then by newest
    query += ` ORDER BY a.pinned DESC, a.created_at DESC LIMIT ? OFFSET ?`;
    const offset = (page - 1) * pageSize;
    params.push(pageSize, offset);

    const [rows] = await connection.query(query, params);

    return {
      data: rows,
      total,
      page,
      pageSize,
    };
  } finally {
    connection.release();
  }
}

// Get specific announcement by ID
async function getAnnouncementById(announcementId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT a.*, u.fullName as createdByName, g.name as guildName 
       FROM announcements a
       LEFT JOIN users u ON a.created_by = u.id
       LEFT JOIN guilds g ON a.guild_id = g.id
       WHERE a.id = ?`,
      [announcementId]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

// Create new announcement
async function createAnnouncement(announcementData) {
  const connection = await pool.getConnection();
  try {
    const { title, content, image_url, pinned, guild_id, created_by } =
      announcementData;

    // Insert announcement record
    const [result] = await connection.query(
      `INSERT INTO announcements (guild_id, title, content, image_url, pinned, created_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [guild_id || null, title, content, image_url || null, pinned || false, created_by]
    );

    return await getAnnouncementById(result.insertId);
  } finally {
    connection.release();
  }
}

// Export all announcement database functions
module.exports = {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
};
