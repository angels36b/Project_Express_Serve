const db = require('../config/db');

/**
 * Maps a physical PostgreSQL row (snake_case) to the API contract object (camelCase).
 * Ensures createdAt is always serialized as an ISO 8601 UTC string.
 *
 * @param {object} row - Raw row returned by pg
 * @returns {object} Task DTO matching API specification
 */
function mapRowToTask(row) {
  return {
    id: row.id,
    ownerLogin: row.owner_login,
    title: row.title,
    done: row.done,
    runId: row.run_id,
    createdAt: new Date(row.created_at).toISOString()
  };
}

/**
 * Inserts a new task record into PostgreSQL using parameterized queries (prevents SQL injection).
 *
 * @param {object} task - Server-populated task fields
 * @returns {Promise<object>} Newly persisted task
 */
async function create({ id, ownerLogin, title, done, runId, createdAt }) {
  const sql = `
    INSERT INTO tasks (id, owner_login, title, done, run_id, created_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, owner_login, title, done, run_id, created_at
  `;
  const result = await db.query(sql, [id, ownerLogin, title, done, runId, createdAt]);
  return mapRowToTask(result.rows[0]);
}

/**
 * Retrieves all tasks belonging to a specific author and runId, ordered chronologically.
 *
 * @param {string} ownerLogin - Configured Moodle login
 * @param {string} runId - Execution/session run identifier
 * @returns {Promise<object[]>} Array of matching tasks (or empty array)
 */
async function findByOwnerAndRunId(ownerLogin, runId) {
  const sql = `
    SELECT id, owner_login, title, done, run_id, created_at
    FROM tasks
    WHERE owner_login = $1 AND run_id = $2
    ORDER BY created_at ASC
  `;
  const result = await db.query(sql, [ownerLogin, runId]);
  return result.rows.map(mapRowToTask);
}

/**
 * Finds a single task by its UUID scoped to the configured ownerLogin.
 *
 * @param {string} id - Task UUID
 * @param {string} ownerLogin - Configured Moodle login
 * @returns {Promise<object|null>} Task object if found, or null
 */
async function findByIdAndOwner(id, ownerLogin) {
  const sql = `
    SELECT id, owner_login, title, done, run_id, created_at
    FROM tasks
    WHERE id = $1 AND owner_login = $2
  `;
  const result = await db.query(sql, [id, ownerLogin]);
  return result.rows[0] ? mapRowToTask(result.rows[0]) : null;
}

/**
 * Dynamically builds and executes a partial UPDATE statement for title and/or done.
 *
 * @param {string} id - Task UUID
 * @param {string} ownerLogin - Configured Moodle login
 * @param {{ title?: string, done?: boolean }} updates - Validated fields to update
 * @returns {Promise<object|null>} Updated task object, or null if not found
 */
async function updateByIdAndOwner(id, ownerLogin, updates) {
  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.title !== undefined) {
    fields.push(`title = $${idx++}`);
    values.push(updates.title);
  }
  if (updates.done !== undefined) {
    fields.push(`done = $${idx++}`);
    values.push(updates.done);
  }

  values.push(id, ownerLogin);

  const sql = `
    UPDATE tasks
    SET ${fields.join(', ')}
    WHERE id = $${idx++} AND owner_login = $${idx}
    RETURNING id, owner_login, title, done, run_id, created_at
  `;
  const result = await db.query(sql, values);
  return result.rows[0] ? mapRowToTask(result.rows[0]) : null;
}

/**
 * Deletes a task by UUID scoped to the configured ownerLogin.
 *
 * @param {string} id - Task UUID
 * @param {string} ownerLogin - Configured Moodle login
 * @returns {Promise<boolean>} True if a row was deleted, false if no matching row existed
 */
async function deleteByIdAndOwner(id, ownerLogin) {
  const sql = `
    DELETE FROM tasks
    WHERE id = $1 AND owner_login = $2
  `;
  const result = await db.query(sql, [id, ownerLogin]);
  return result.rowCount > 0;
}

module.exports = {
  create,
  findByOwnerAndRunId,
  findByIdAndOwner,
  updateByIdAndOwner,
  deleteByIdAndOwner
};