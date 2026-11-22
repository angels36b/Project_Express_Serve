const taskService = require('./services/taskService');
const {
  validateUuid,
  validateRunId,
  validateCreateTask,
  validateUpdateTask
} = require('../validators/taskValidator');

/**
 * Handles POST /api/tasks/.
 * Validates JSON body, persists new task, and returns HTTP 201 with created resource.
 */
async function createTask(req, res, next) {
  try {
    const { error, value } = validateCreateTask(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    const created = await taskService.createTask(value);
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

/**
 * Handles GET /api/tasks/?runId=...
 * Validates mandatory runId query parameter and returns HTTP 200 with matching tasks array.
 */
async function listTasks(req, res, next) {
  try {
    const { runId } = req.query;
    const runIdError = validateRunId(runId);
    if (runIdError) {
      return res.status(400).json({ error: runIdError });
    }

    const tasks = await taskService.listTasksByRunId(runId);
    return res.status(200).json(tasks);
  } catch (err) {
    return next(err);
  }
}

/**
 * Handles GET /api/tasks/:id/.
 * Validates UUID parameter and returns HTTP 200 with task or HTTP 404 if missing.
 */
async function getTask(req, res, next) {
  try {
    const uuidError = validateUuid(req.params.id);
    if (uuidError) {
      return res.status(400).json({ error: uuidError });
    }

    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json(task);
  } catch (err) {
    return next(err);
  }
}

/**
 * Handles PATCH /api/tasks/:id/.
 * Validates UUID and partial update payload; returns HTTP 200 with updated task or HTTP 404.
 */
async function updateTask(req, res, next) {
  try {
    const uuidError = validateUuid(req.params.id);
    if (uuidError) {
      return res.status(400).json({ error: uuidError });
    }

    const { error, value } = validateUpdateTask(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    const updated = await taskService.updateTask(req.params.id, value);
    if (!updated) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
}

/**
 * Handles DELETE /api/tasks/:id/.
 * Validates UUID and deletes task; returns HTTP 204 (empty body) or HTTP 404 if not found.
 */
async function deleteTask(req, res, next) {
  try {
    const uuidError = validateUuid(req.params.id);
    if (uuidError) {
      return res.status(400).json({ error: uuidError });
    }

    const deleted = await taskService.deleteTask(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask
};