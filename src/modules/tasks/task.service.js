const Task = require('./task.model');
const AppError = require('../../utils/AppError');


const createTask = async (taskData, userId) => {
  const task = await Task.create({ ...taskData, userId });
  return task;
};


const getAllTasks = async (userId) => {
  const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
  return tasks;
};


const getTaskById = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId });

  if (!task) {
    
    throw new AppError('Task not found', 404);
  }

  return task;
};


const updateTask = async (taskId, userId, updates) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId }, 
    updates,
    {
      new: true,         
      runValidators: true,
    }
  );

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return task;
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, userId });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return task;
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };