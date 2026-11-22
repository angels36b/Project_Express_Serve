const crypto = require('crypto');
const config = require('../config/env');
const taskRepository = require('../repositories/taskRepository');

/**
 * Creates a new task by enriching client input with server-controlled metadata:
 * UUID v4 id, configured ownerLogin, initial done=false, and UTC ISO 8601 createdAt.
 *
 * @param {{ title: string, runId: string }} data - Validated input from client
 * @returns {Promise<object>} Created task
 */
async function createTask({ title, runId }) {
  const newTask = {
    id: crypto.randomUUID(),
    ownerLogin: config.moodleLogin,
    title,
    done: false,
    runId,
    createdAt: new Date().toISOString()
  };

  return taskRepository.create(newTask);
}

/**
 * Lists all tasks for the configured Moodle author filtered by runId.
 *
 * @param {string} runId - Validated runId string
 * @returns {Promise<object[]>} List of tasks
 */
async function listTasksByRunId(runId) {
  return taskRepository.findByOwnerAndRunId(config.moodleLogin, runId);
}

/**
 * Retrieves a single task by ID belonging to the configured Moodle author.
 *
 * @param {string} id - Validated UUID string
 * @returns {Promise<object|null>} Task object or null
 */
async function getTaskById(id) {
  return taskRepository.findByIdAndOwner(id, config.moodleLogin);
}

/**
 * Updates title and/or completion status of an existing task.
 *
 * @param {string} id - Validated UUID string
 * @param {{ title?: string, done?: boolean }} updates - Validated partial updates
 * @returns {Promise<object|null>} Updated task or null if not found
 */
async function updateTask(id, updates) {
  return taskRepository.updateByIdAndOwner(id, config.moodleLogin, updates);
}

/**
 * Deletes an existing task by ID.
 *
 * @param {string} id - Validated UUID string
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
async function deleteTask(id) {
  return taskRepository.deleteByIdAndOwner(id, config.moodleLogin);
}

module.exports = {
  createTask,
  listTasksByRunId,
  getTaskById,
  updateTask,
  deleteTask
};