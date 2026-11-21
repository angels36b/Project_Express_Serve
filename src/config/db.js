const { Pool } = require('pg');
const config = require('./env');

const isLocal = config.databaseUrl.includes('localhost') || config.databaseUrl.includes('127.0.0.1');

const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

// Prevent unhandled pool errors from crashing the Node process
pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

async function query(text, params) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    // Wrap database/connectivity errors so errorHandler returns HTTP 503
    const dbError = new Error('Database service unavailable');
    dbError.statusCode = 503;
    dbError.cause = err;
    throw dbError;
  }
}

async function checkConnection() {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  query,
  checkConnection
};