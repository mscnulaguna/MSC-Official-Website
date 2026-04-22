// Import MySQL2 promise-based library
const mysql = require('mysql2/promise');

// Create connection pool with environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'msc_nulaguna',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export pool for database operations
module.exports = pool;
