const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { taskValidation } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

router.post('/', authenticate, taskValidation.create, taskController.createTask);
router.get('/', authenticate, taskController.getAllTasks);
router.get('/:id', authenticate, taskValidation.getById, taskController.getTaskById);
router.put('/:id', authenticate, taskValidation.update, taskController.updateTask);
router.delete('/:id', authenticate, taskValidation.delete, taskController.deleteTask);

module.exports = router;
