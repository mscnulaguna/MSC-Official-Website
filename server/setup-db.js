// Database setup: creates DB, tables, and seeds admin user
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectWithRetry(maxAttempts = 30, delayMs = 2000) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const config = {
        // .trim() removes any accidental spaces from your .env file
        host: process.env.DB_HOST ? process.env.DB_HOST.trim() : 'localhost',
        user: process.env.DB_USER ? process.env.DB_USER.trim() : 'root',
        password: process.env.DB_PASSWORD || '',
        // Force SSL unconditionally for this production run
        ssl: {
          rejectUnauthorized: false
        }
      };

      // Print this out on the first try so we know the new code is running
      if (attempt === 1) {
        console.log(`[db-init] Attempting connection to: ${config.host} with SSL FORCEABLY ENABLED.`);
      }

      return await mysql.createConnection(config);
    } catch (error) {
      lastError = error;
      console.log(
        `[db-init] Waiting for MySQL (${attempt}/${maxAttempts}): ${error.code || error.message}`
      );

      if (attempt < maxAttempts) {
        await sleep(delayMs);
      }
    }
  }

  throw lastError;
}

async function setup() {
  // Connect without specifying DB first to create it
  const conn = await connectWithRetry();

  const dbName = process.env.DB_NAME || 'msc_nulaguna';

  console.log(`\n[1/4] Creating database "${dbName}" if not exists...`);
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await conn.query(`USE \`${dbName}\``);
  console.log('  OK');

  console.log('\n[2/4] Creating tables...');

  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      studentId VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      fullName VARCHAR(255) NOT NULL,
      yearLevel INT NOT NULL,
      course VARCHAR(255) NOT NULL,
      role ENUM('member', 'officer', 'admin') DEFAULT 'member',
      profilePhoto VARCHAR(500),
      lastSynced DATETIME,
      isActive BOOLEAN DEFAULT TRUE,
      requiresPasswordChange BOOLEAN DEFAULT TRUE,
      temporaryPassword VARCHAR(255),
      tempPasswordCreatedAt TIMESTAMP NULL,
      emergencyContact VARCHAR(255),
      contactNumber VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS guilds (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      image_url VARCHAR(500),
      roadmap JSON,
      created_by INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS guild_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guild_id INT NOT NULL,
      user_id INT NOT NULL,
      role ENUM('member', 'officer', 'admin') DEFAULT 'member',
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (guild_id) REFERENCES guilds(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_guild_user (guild_id, user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS guild_applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guild_id INT NOT NULL,
      user_id INT NOT NULL,
      motivation TEXT NOT NULL,
      experience TEXT,
      portfolioUrl VARCHAR(500),
      status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (guild_id) REFERENCES guilds(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_guild_user_application (guild_id, user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS guild_resources (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guild_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      type ENUM('video', 'pdf', 'quiz', 'link') NOT NULL,
      url VARCHAR(500) NOT NULL,
      level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
      tags JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (guild_id) REFERENCES guilds(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guild_id INT,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      coverImage VARCHAR(500),
      start_date DATETIME NOT NULL,
      end_date DATETIME NOT NULL,
      location VARCHAR(500),
      max_capacity INT,
      type ENUM('workshop', 'seminar', 'competition', 'social'),
      agenda JSON,
      speakers JSON,
      created_by INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (guild_id) REFERENCES guilds(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS event_registrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_id INT NOT NULL,
      user_id INT NOT NULL,
      status ENUM('registered', 'attended', 'cancelled') DEFAULT 'registered',
      confirmationCode VARCHAR(255) UNIQUE,
      qrCode TEXT,
      registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_event_user (event_id, user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS announcements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guild_id INT,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      image_url VARCHAR(500),
      pinned BOOLEAN DEFAULT FALSE,
      created_by INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (guild_id) REFERENCES guilds(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS partners (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      logo_url VARCHAR(500),
      website_url VARCHAR(500),
      email VARCHAR(255),
      phone VARCHAR(20),
      tier ENUM('bronze', 'silver', 'gold', 'platinum'),
      created_by INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  ];

  for (const sql of tables) {
    await conn.query(sql);
  }
  console.log('  OK - all tables created');

  console.log('\n[3/4] Seeding admin user...');

  // Check if admin already exists
  const [existing] = await conn.execute(
    'SELECT id FROM users WHERE email = ?',
    ['cabasec@students.nu-laguna.edu.ph']
  );

  if (existing.length > 0) {
    // Update password to make sure it's correct
    const hashedPassword = await bcrypt.hash('Password123', 10);
    await conn.execute(
      'UPDATE users SET password = ?, requiresPasswordChange = FALSE WHERE email = ?',
      [hashedPassword, 'cabasec@students.nu-laguna.edu.ph']
    );
    console.log('  Admin user already exists - password reset to Password123');
  } else {
    const hashedPassword = await bcrypt.hash('Password123', 10);
    await conn.execute(
      `INSERT INTO users (studentId, email, password, fullName, yearLevel, course, role, isActive, requiresPasswordChange)
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, FALSE)`,
      ['2021-00001', 'cabasec@students.nu-laguna.edu.ph', hashedPassword, 'Admin User', 4, 'BSIT', 'admin']
    );
    console.log('  Admin user created');
  }

  // Also seed 3 sample members for testing
  const sampleUsers = [
    { studentId: '2021-00002', email: 'member1@students.nu-laguna.edu.ph', fullName: 'Juan Dela Cruz', yearLevel: 2, course: 'BSCS', role: 'member' },
    { studentId: '2021-00003', email: 'member2@students.nu-laguna.edu.ph', fullName: 'Maria Santos', yearLevel: 3, course: 'BSIT', role: 'officer' },
    { studentId: '2021-00004', email: 'member3@students.nu-laguna.edu.ph', fullName: 'Jose Reyes', yearLevel: 1, course: 'BSCS', role: 'member' },
  ];

  for (const user of sampleUsers) {
    const [exists] = await conn.execute('SELECT id FROM users WHERE email = ?', [user.email]);
    if (exists.length === 0) {
      const hashed = await bcrypt.hash('Password123', 10);
      await conn.execute(
        `INSERT INTO users (studentId, email, password, fullName, yearLevel, course, role, isActive, requiresPasswordChange)
         VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, TRUE)`,
        [user.studentId, user.email, hashed, user.fullName, user.yearLevel, user.course, user.role]
      );
      console.log(`  Created: ${user.fullName} (${user.role})`);
    }
  }

  console.log('\n[4/4] Verifying connection...');
  const [users] = await conn.execute('SELECT id, email, role FROM users');
  console.log(`  Found ${users.length} user(s) in database:`);
  users.forEach(u => console.log(`    - ${u.email} [${u.role}]`));

  await conn.end();
  console.log('\n✓ Database setup complete!');
  console.log('\nLogin credentials:');
  console.log('  Email:    cabasec@students.nu-laguna.edu.ph');
  console.log('  Password: Password123\n');
}

setup().catch(err => {
  console.error('\n✗ Setup failed:', err.message);
  process.exit(1);
});
