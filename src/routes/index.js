const express = require('express');
const requireAuth = require('../middlewares/auth');
const authorController = require('../controllers/authorController');
const taskController = require('../controllers/taskController');

const router = express.Router({ strict: true });

// Public endpoint (no Bearer token required)
router.get('/login/', authorController.getLogin);

// Protected API endpoints (require Authorization: Bearer <token>)
router.get('/api/author/', requireAuth, authorController.getAuthor);
router.post('/api/tasks/', requireAuth, taskController.createTask);
router.get('/api/tasks/', requireAuth, taskController.listTasks);
router.get('/api/tasks/:id/', requireAuth, taskController.getTask);
router.patch('/api/tasks/:id/', requireAuth, taskController.updateTask);
router.delete('/api/tasks/:id/', requireAuth, taskController.deleteTask);

module.exports = router;