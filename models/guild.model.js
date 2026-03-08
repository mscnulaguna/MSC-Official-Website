// Import database connection pool
const pool = require('../config/db');

// Get all guilds with member count and leader info
async function getAllGuilds() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT g.*, 
              COUNT(DISTINCT gm.user_id) as memberCount,
              u.fullName as leaderName
       FROM guilds g
       LEFT JOIN guild_members gm ON g.id = gm.guild_id
       LEFT JOIN users u ON g.created_by = u.id
       GROUP BY g.id
       ORDER BY g.name`
    );
    return rows;
  } finally {
    connection.release();
  }
}

// Get guild by slug with member count and leader info
async function getGuildBySlug(slug) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT g.*, 
              COUNT(DISTINCT gm.user_id) as memberCount,
              u.fullName as leaderName
       FROM guilds g
       LEFT JOIN guild_members gm ON g.id = gm.guild_id
       LEFT JOIN users u ON g.created_by = u.id
       WHERE g.slug = ?
       GROUP BY g.id`,
      [slug]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

// Get all members of a specific guild
async function getGuildMembers(guildId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT gm.id, gm.guild_id, gm.user_id, gm.role as guildRole, gm.joined_at,
              u.fullName, u.email, u.studentId, u.yearLevel, u.course, u.role as userRole
       FROM guild_members gm
       JOIN users u ON gm.user_id = u.id
       WHERE gm.guild_id = ?
       ORDER BY gm.joined_at DESC`,
      [guildId]
    );
    return rows;
  } finally {
    connection.release();
  }
}

// Get resources for a guild with optional filtering
async function getGuildResources(guildId, filters = {}) {
  const connection = await pool.getConnection();
  try {
    let query = `SELECT * FROM guild_resources WHERE guild_id = ?`;
    const params = [guildId];

    // Filter by level if provided
    if (filters.level) {
      query += ` AND level = ?`;
      params.push(filters.level);
    }

    // Filter by type if provided
    if (filters.type) {
      query += ` AND type = ?`;
      params.push(filters.type);
    }

    query += ` ORDER BY created_at DESC`;

    const [rows] = await connection.query(query, params);
    return rows;
  } finally {
    connection.release();
  }
}

// Get existing application for a user to a guild
async function getGuildApplication(guildId, userId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT * FROM guild_applications WHERE guild_id = ? AND user_id = ?`,
      [guildId, userId]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

// Create a new guild application
async function createGuildApplication(guildId, userId, motivation, experience, portfolioUrl) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `INSERT INTO guild_applications (guild_id, user_id, motivation, experience, portfolioUrl, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [guildId, userId, motivation, experience || null, portfolioUrl || null]
    );
    return result.insertId;
  } finally {
    connection.release();
  }
}

// Add a user to a guild and mark their application as approved
async function addGuildMember(guildId, userId) {
  const connection = await pool.getConnection();
  try {
    // Mark the application as approved if one exists
    await connection.query(
      `UPDATE guild_applications SET status = 'approved', updated_at = CURRENT_TIMESTAMP WHERE guild_id = ? AND user_id = ?`,
      [guildId, userId]
    );
    // INSERT IGNORE skips silently if user is already a member
    await connection.query(
      `INSERT IGNORE INTO guild_members (guild_id, user_id, role) VALUES (?, ?, 'member')`,
      [guildId, userId]
    );
    return true;
  } finally {
    connection.release();
  }
}

// Get guild by ID (used for validation in other modules)
async function getGuildById(guildId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT id, name, slug FROM guilds WHERE id = ?`,
      [guildId]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

// Export all guild database functions
module.exports = {
  getAllGuilds,
  getGuildBySlug,
  getGuildById,
  getGuildMembers,
  getGuildResources,
  getGuildApplication,
  createGuildApplication,
  addGuildMember,
}
