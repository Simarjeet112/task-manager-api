const catchAsync = require('../../utils/catchAsync');
const taskService = require('./task.service');

exports.createTask = catchAsync(async (req, res) => {
  
  const task = await taskService.createTask(req.body, req.user.id);

  res.status(201).json({
    status: 'success',
    data: { task },
  });
});

exports.getAllTasks = catchAsync(async (req, res) => {
  const tasks = await taskService.getAllTasks(req.user.id);

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: { tasks },
  });
});

exports.getTaskById = catchAsync(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id, req.user.id);

  res.status(200).json({
    status: 'success',
    data: { task },
  });
});

exports.updateTask = catchAsync(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.user.id, req.body);

  res.status(200).json({
    status: 'success',
    data: { task },
  });
});

exports.deleteTask = catchAsync(async (req, res) => {
  await taskService.deleteTask(req.params.id, req.user.id);

  
  res.status(204).json({
    status: 'success',
    data: null,
  });
});