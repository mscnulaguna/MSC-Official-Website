// Import database connection pool
const { update } = require('three/examples/jsm/libs/tween.module.js');
const pool = require('../config/db');

// Get paginated list of partners sorted by tier then name
async function getAllPartners(page = 1, pageSize = 20) {
  const connection = await pool.getConnection();
  try {
    const [[{ total }]] = await connection.query(
      `SELECT COUNT(*) as total FROM partners`
    );

    const offset = (page - 1) * pageSize;
    const [rows] = await connection.query(
      `SELECT p.*, u.fullName as createdByName 
       FROM partners p
       LEFT JOIN users u ON p.created_by = u.id
       ORDER BY FIELD(p.tier,'platinum','gold','silver','bronze'), p.name
       LIMIT ? OFFSET ?`,
      [pageSize, offset]
    );

    return { data: rows, total, page, pageSize };
  } finally {
    connection.release();
  }
}

// Get specific partner by ID
async function getPartnerById(partnerId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT p.*, u.fullName as createdByName 
       FROM partners p
       LEFT JOIN users u ON p.created_by = u.id
       WHERE p.id = ?`,
      [partnerId]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

// Create new partner
async function createPartner(partnerData) {
  const connection = await pool.getConnection();
  try {
    const { name, description, logo_url, website_url, tier, created_by } =
      partnerData;

    // Insert partner record with default bronze tier
    const [result] = await connection.query(
      `INSERT INTO partners (name, description, logo_url, website_url, tier, created_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, logo_url, website_url, tier || 'bronze', created_by]
    );

    return await getPartnerById(result.insertId);
  } finally {
    connection.release();
  }
}

async function updatePartner(partnerId, partnerData) {
  const connection = await pool.getConnection();
  try {
    const { name, description, logo_url, website_url } = partnerData;

    await connection.query(
      `UPDATE partners
      SET name = ?, description = ?, logo_url = ?, website_url = ?
      WHERE id = ?`,
      [name, description, logo_url, website_url, partnerId]
    );

    return await getPartnerById(partnerId);
  } finally {
    connection.release();
  } 
}

async function deletePartner(partnerId) {
  const connection = await pool.getConnection();
  try {
    await connection.query(`DELETE FROM partners WHERE id = ?`, [partnerId]);
  } finally {
    connection.release();
  }
}

// Export all partner database functions
module.exports = {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
};
