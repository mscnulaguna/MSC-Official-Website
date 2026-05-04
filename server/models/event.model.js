// Import database connection pool
const pool = require('../config/db');

// Get paginated list of events with filtering by status, guild, and type
async function getAllEvents(page = 1, pageSize = 50, filters = {}) {
  const connection = await pool.getConnection();
  try {
    const safePage = Number.isFinite(Number(page)) && Number(page) > 0 ? Math.floor(Number(page)) : 1;
    const safePageSize = Number.isFinite(Number(pageSize)) && Number(pageSize) > 0
      ? Math.floor(Number(pageSize))
      : 50;

    let query = `
      SELECT e.*, 
             u.fullName as createdByName, 
             g.name as guildName,
             g.slug as guildSlug,
             COALESCE(er_counts.registeredCount, 0) as registeredCount
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN guilds g ON e.guild_id = g.id
      LEFT JOIN (
        SELECT event_id, COUNT(*) as registeredCount
        FROM event_registrations
        WHERE status != 'cancelled'
        GROUP BY event_id
      ) er_counts ON e.id = er_counts.event_id
      WHERE 1=1
    `;
    const params = [];

    // Filter by event status (upcoming, past, or all)
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'upcoming') {
        query += ` AND e.start_date > NOW()`;
      } else if (filters.status === 'past') {
        query += ` AND e.end_date < NOW()`;
      }
    }

    // Filter by guild
    if (filters.guild) {
      query += ` AND g.slug = ?`;
      params.push(filters.guild);
    }

    // Filter by event type
    if (filters.type) {
      query += ` AND e.type = ?`;
      params.push(filters.type);
    }

    // Count total matching events
    const countQuery = `
      SELECT COUNT(DISTINCT e.id) as total FROM events e
      LEFT JOIN guilds g ON e.guild_id = g.id
      WHERE 1=1
      ${filters.status && filters.status !== 'all' ? (filters.status === 'upcoming' ? ' AND e.start_date > NOW()' : ' AND e.end_date < NOW()') : ''}
      ${filters.guild ? ' AND g.slug = ?' : ''}
      ${filters.type ? ' AND e.type = ?' : ''}
    `;
    const countParams = [];
    if (filters.guild) countParams.push(filters.guild);
    if (filters.type) countParams.push(filters.type);

    const [countResult] = await connection.execute(countQuery, countParams);
    const total = countResult[0].total;

    // Use literal numeric pagination values to avoid stmt arg issues with LIMIT/OFFSET.
    const offset = (safePage - 1) * safePageSize;
    query += ` ORDER BY e.start_date DESC LIMIT ${safePageSize} OFFSET ${offset}`;

    const [rows] = await connection.execute(query, params);

    return {
      data: rows,
      total,
      page: safePage,
      pageSize: safePageSize,
    };
  } finally {
    connection.release();
  }
}

// Get specific event details with registration count
async function getEventById(eventId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      `
      SELECT e.*,
             u.fullName as createdByName,
             g.name as guildName,
             g.slug as guildSlug,
             COALESCE(er_counts.registeredCount, 0) as registeredCount
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN guilds g ON e.guild_id = g.id
      LEFT JOIN (
        SELECT event_id, COUNT(*) as registeredCount
        FROM event_registrations
        WHERE status != 'cancelled'
        GROUP BY event_id
      ) er_counts ON e.id = er_counts.event_id
      WHERE e.id = ?
      `,
      [eventId]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

// Create new event
async function createEvent(eventData) {
  const connection = await pool.getConnection();
  try {
    const {
      guild_id,
      title,
      description,
      coverImage,
      start_date,
      end_date,
      location,
      max_capacity,
      type,
      agenda,
      speakers,
      created_by,
    } = eventData;

    // Insert event record
    const [result] = await connection.execute(
      `
      INSERT INTO events (
        guild_id, title, description, coverImage, 
        start_date, end_date, location, max_capacity, 
        type, agenda, speakers, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        guild_id || null,
        title,
        description,
        coverImage,
        start_date,
        end_date,
        location,
        max_capacity,
        type,
        agenda ? JSON.stringify(agenda) : null,
        speakers ? JSON.stringify(speakers) : null,
        created_by,
      ]
    );

    return await getEventById(result.insertId);
  } finally {
    connection.release();
  }
}

// Update an existing event
async function updateEvent(eventId, eventData) {
  const connection = await pool.getConnection();
  try {
    const {
      guild_id,
      title,
      description,
      coverImage,
      start_date,
      end_date,
      location,
      max_capacity,
      type,
      agenda,
      speakers,
    } = eventData;

    await connection.execute(
      `
      UPDATE events
      SET guild_id = ?,
          title = ?,
          description = ?,
          coverImage = ?,
          start_date = ?,
          end_date = ?,
          location = ?,
          max_capacity = ?,
          type = ?,
          agenda = ?,
          speakers = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        guild_id || null,
        title,
        description,
        coverImage,
        start_date,
        end_date,
        location,
        max_capacity,
        type,
        agenda ? JSON.stringify(agenda) : null,
        speakers ? JSON.stringify(speakers) : null,
        eventId,
      ]
    );

    return await getEventById(eventId);
  } finally {
    connection.release();
  }
}

// Register user for event with QR code and confirmation
async function registerUserForEvent(eventId, userId, confirmationCode, qrCode) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      `
      INSERT INTO event_registrations (
        event_id, user_id, status, confirmationCode, qrCode
      ) VALUES (?, ?, ?, ?, ?)
      `,
      [eventId, userId, 'registered', confirmationCode, qrCode]
    );

    return {
      id: result.insertId,
      eventId,
      userId,
      status: 'registered',
      confirmationCode,
      qrCode,
    };
  } finally {
    connection.release();
  }
}

// Mark user attendance for event using QR code
async function markAttendance(eventId, userId) {
  const connection = await pool.getConnection();
  try {
    // Update registration status to attended
    await connection.execute(
      `
      UPDATE event_registrations 
      SET status = 'attended', updated_at = CURRENT_TIMESTAMP
      WHERE event_id = ? AND user_id = ?
      `,
      [eventId, userId]
    );

    // Return updated record with user info
    const [rows] = await connection.execute(
      `
      SELECT er.*, u.fullName 
      FROM event_registrations er
      JOIN users u ON er.user_id = u.id
      WHERE er.event_id = ? AND er.user_id = ?
      `,
      [eventId, userId]
    );

    return rows[0] || null;
  } finally {
    connection.release();
  }
}

// Get event attendance records and statistics
async function getEventAttendance(eventId) {
  const connection = await pool.getConnection();
  try {
    // Get only attended users with userId, name, timestamp
    const [attendees] = await connection.execute(
      `
      SELECT 
        er.user_id as userId,
        u.fullName as name,
        er.updated_at as timestamp
      FROM event_registrations er
      JOIN users u ON er.user_id = u.id
      WHERE er.event_id = ? AND er.status = 'attended'
      ORDER BY er.updated_at DESC
      `,
      [eventId]
    );

    // Get registration and attendance statistics
    const [stats] = await connection.execute(
      `
      SELECT 
        COUNT(CASE WHEN status = 'registered' THEN 1 END) as registrationCount,
        COUNT(CASE WHEN status = 'attended' THEN 1 END) as attendanceCount
      FROM event_registrations
      WHERE event_id = ?
      `,
      [eventId]
    );

    return {
      attendees,
      stats: stats[0] || { registrationCount: 0, attendanceCount: 0 },
    };
  } finally {
    connection.release();
  }
}

// Get event capacity info (max capacity vs registered count)
async function getEventCapacity(eventId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      `
      SELECT e.max_capacity,
             COALESCE(er_counts.registeredCount, 0) as registeredCount
      FROM events e
      LEFT JOIN (
        SELECT event_id, COUNT(*) as registeredCount
        FROM event_registrations
        WHERE status != 'cancelled'
        GROUP BY event_id
      ) er_counts ON e.id = er_counts.event_id
      WHERE e.id = ?
      `,
      [eventId]
    );

    if (!rows[0]) return null;

    return {
      maxCapacity: rows[0].max_capacity,
      registeredCount: rows[0].registeredCount || 0,
      isFull: rows[0].max_capacity && rows[0].registeredCount >= rows[0].max_capacity,
    };
  } finally {
    connection.release();
  }
}

// Get a list of event IDs that the given user is registered for
async function getUserRegisteredEventIds(userId, eventIds = []) {
  if (!Array.isArray(eventIds) || eventIds.length === 0) return [];

  const connection = await pool.getConnection();
  try {
    // Build dynamic placeholders for IN clause
    const placeholders = eventIds.map(() => '?').join(',');
    
    const sql = `
      SELECT DISTINCT event_id
      FROM event_registrations
      WHERE user_id = ? 
        AND status != 'cancelled' 
        AND event_id IN (${placeholders})
    `;
    
    const params = [userId, ...eventIds];
    const [rows] = await connection.execute(sql, params);
    
    return rows.map((r) => r.event_id);
  } finally {
    connection.release();
  }
}

// Check if single user is registered for single event
async function isUserRegistered(eventId, userId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      `
      SELECT id FROM event_registrations 
      WHERE event_id = ? AND user_id = ? AND status != 'cancelled'
      `,
      [eventId, userId]
    );
    return rows.length > 0;
  } finally {
    connection.release();
  }
}

// Export all event database functions
module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  isUserRegistered,
  registerUserForEvent,
  markAttendance,
  getEventAttendance,
  getEventCapacity,
  getUserRegisteredEventIds,
};
