// Import database connection pool and encryption library
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Create new user in database
async function createUser(userData) {
  const connection = await pool.getConnection();
  try {
    const {
      studentId,
      email,
      password,
      fullName,
      yearLevel,
      course,
      role = 'member',
      temporaryPassword = null,
    } = userData;

    // Insert user record with default role and status
    const [result] = await connection.execute(
      `INSERT INTO users (studentId, email, password, fullName, yearLevel, course, role, isActive, requiresPasswordChange, temporaryPassword, tempPasswordCreatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CASE WHEN ? IS NOT NULL THEN NOW() ELSE NULL END)`,
      [studentId, email, password, fullName, yearLevel, course, role, true, true, temporaryPassword, temporaryPassword]
    );

    return await findUserById(result.insertId);
  } finally {
    connection.release();
  }
}

// Find user by email address
async function findUserByEmail(email) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

// Find user by user ID
async function findUserById(userId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

// Find user by student ID
async function findUserByStudentId(studentId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE studentId = ?',
      [studentId]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

// Get paginated list of users with optional filters
async function getAllUsers(page = 1, pageSize = 20, filters = {}) {
  const connection = await pool.getConnection();
  try {
    let query = 'SELECT * FROM users WHERE 1=1';
    const params = [];

    // Filter by role if provided
    if (filters.role) {
      query += ' AND role = ?';
      params.push(filters.role);
    }

    // Filter by guild membership if provided
    if (filters.guild) {
      query += ` AND id IN (
        SELECT gm.user_id FROM guild_members gm 
        JOIN guilds g ON gm.guild_id = g.id 
        WHERE g.slug = ?
      )`;
      params.push(filters.guild);
    }

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) as total FROM users WHERE 1=1 ${
      filters.role ? 'AND role = ?' : ''
    }${filters.guild ? ' AND id IN (SELECT gm.user_id FROM guild_members gm JOIN guilds g ON gm.guild_id = g.id WHERE g.slug = ?)' : ''}`;
    
    const [countResult] = await connection.execute(countQuery, params);
    const total = countResult[0].total;

    // Get paginated results sorted by newest first
    const offset = (page - 1) * pageSize;
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    const [rows] = await connection.execute(query, params);

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

// Update user profile information
async function updateUser(userId, updates) {
  const connection = await pool.getConnection();
  try {
    const {
      fullName, yearLevel, course, profilePhoto,
      emergencyContact, contactNumber,
      role,        // admin: role change
      isActive,    // admin: deactivate/reactivate
    } = updates;

    // Update only provided fields, keep others unchanged
    await connection.execute(
      `UPDATE users SET 
       fullName = COALESCE(?, fullName),
       yearLevel = COALESCE(?, yearLevel),
       course = COALESCE(?, course),
       profilePhoto = COALESCE(?, profilePhoto),
       emergencyContact = COALESCE(?, emergencyContact),
       contactNumber = COALESCE(?, contactNumber),
       role = COALESCE(?, role),
       isActive = CASE WHEN ? IS NOT NULL THEN ? ELSE isActive END,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        fullName || null,
        yearLevel || null,
        course || null,
        profilePhoto || null,
        emergencyContact || null,
        contactNumber || null,
        role || null,
        isActive !== undefined ? String(isActive) : null,
        isActive !== undefined ? isActive : null,
        userId,
      ]
    );

    return await findUserById(userId);
  } finally {
    connection.release();
  }
}

// Update user password with hashing
async function updateUserPassword(userId, hashedPassword) {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      `UPDATE users SET 
       password = ?,
       requiresPasswordChange = FALSE,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [hashedPassword, userId]
    );

    return await findUserById(userId);
  } finally {
    connection.release();
  }
}

// Compare plain password with hashed password
async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// Bulk update temporary passwords for multiple users.
// Contract: updates = [{ userId, tempPassword }]
async function bulkResetPasswords(updates) {
  if (!Array.isArray(updates) || updates.length === 0) {
    throw new TypeError('bulkResetPasswords expects a non-empty updates array');
  }

  // Validate/normalize payload so wrong callsites fail fast with a clear error.
  const normalizedUpdates = updates.map((update, index) => {
    if (!update || typeof update !== 'object') {
      throw new TypeError(`bulkResetPasswords: updates[${index}] must be an object`);
    }

    const { userId, tempPassword } = update;

    if (userId === undefined || userId === null || userId === '') {
      throw new TypeError(`bulkResetPasswords: updates[${index}].userId is required`);
    }

    if (typeof tempPassword !== 'string' || tempPassword.trim().length === 0) {
      throw new TypeError(`bulkResetPasswords: updates[${index}].tempPassword must be a non-empty string`);
    }

    return {
      userId,
      tempPassword,
    };
  });

  const connection = await pool.getConnection();
  try {
    for (const update of normalizedUpdates) {
      const hashedTempPassword = await bcrypt.hash(update.tempPassword, 10);
      await connection.execute(
        `UPDATE users SET 
         temporaryPassword = ?, 
         password = ?, 
         requiresPasswordChange = TRUE, 
         tempPasswordCreatedAt = NOW(),
         updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [hashedTempPassword, hashedTempPassword, update.userId]
      );
    }
    return true;
  } finally {
    connection.release();
  }
}

// Clear temp password after first successful temporary-password login
async function clearTemporaryPassword(userId) {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      `UPDATE users SET temporaryPassword = NULL, tempPasswordCreatedAt = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [userId]
    );
    return await findUserById(userId);
  } finally {
    connection.release();
  }
}

// Get all guilds a user belongs to
async function getUserGuilds(userId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT g.id, g.name, g.slug FROM guild_members gm
       JOIN guilds g ON gm.guild_id = g.id
       WHERE gm.user_id = ?
       ORDER BY g.name`,
      [userId]
    );
    return rows;
  } finally {
    connection.release();
  }
}

// Batch-fetch guilds for multiple users — avoids N+1 queries in list endpoints
async function getBulkUserGuilds(userIds) {
  if (!userIds || userIds.length === 0) return {};
  const connection = await pool.getConnection();
  try {
    const placeholders = userIds.map(() => '?').join(',');
    const [rows] = await connection.execute(
      `SELECT gm.user_id, g.id, g.name, g.slug FROM guild_members gm
       JOIN guilds g ON gm.guild_id = g.id
       WHERE gm.user_id IN (${placeholders})
       ORDER BY g.name`,
      userIds
    );
    const result = {};
    for (const row of rows) {
      if (!result[row.user_id]) result[row.user_id] = [];
      result[row.user_id].push({ id: String(row.id), name: row.name, slug: row.slug });
    }
    return result;
  } finally {
    connection.release();
  }
}

// Export all user database functions
module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByStudentId,
  getAllUsers,
  updateUser,
  updateUserPassword,
  verifyPassword,
  bulkResetPasswords,
  clearTemporaryPassword,
  getUserGuilds,
  getBulkUserGuilds,
};
