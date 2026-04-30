const express = require('express');
const router = express.Router();
const taskController = require('./task.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const { createTaskSchema, updateTaskSchema } = require('./task.validation');

router.use(authMiddleware);

router.route('/')
  .get(taskController.getAllTasks)
  .post(validate(createTaskSchema), taskController.createTask);

router.route('/:id')
  .get(taskController.getTaskById)
  .patch(validate(updateTaskSchema), taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;