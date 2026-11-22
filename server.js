// server.js
const config = require('./src/config/env.js');
const app = require('./src/app');
const db = require('./src/config/db');

/**
 * Verifies initial database connectivity and starts the HTTP server.
 * Even if the initial DB check fails, the server boots so API routes can properly return HTTP 503.
 */
async function startServer() {
  try {
    await db.checkConnection();
    console.log('Connected to PostgreSQL successfully.');
  } catch (err) {
    console.warn('Warning: Initial database check failed. API will return 503 until DB is reachable.');
  }

  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
}

startServer();