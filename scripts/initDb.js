require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function initDb() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is not defined in environment variables.');
    process.exit(1);
  }

  const sqlPath = path.join(__dirname, '..', 'sql', '001_init.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  try {
    await pool.query(sql);
    console.log('Database schema initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize database schema:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

initDb();