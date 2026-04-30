const Task = require('./task.model');
const AppError = require('../../utils/AppError');

// Create a task — userId always comes from req.user, never from req.body
// This means a user can NEVER create a task for someone else
const createTask = async (taskData, userId) => {
  const task = await Task.create({ ...taskData, userId });
  return task;
};

// Get all tasks belonging to this user only
const getAllTasks = async (userId) => {
  const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
  return tasks;
};

// Get single task — MUST belong to this user
const getTaskById = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId });

  if (!task) {
    // We deliberately don't say "task belongs to another user"
    // That would leak information. 404 is the safe response.
    throw new AppError('Task not found', 404);
  }

  return task;
};

// Partial update — findOneAndUpdate with both _id AND userId
// A user cannot update another user's task even if they know the ID
const updateTask = async (taskId, userId, updates) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId },  // filter — ownership enforced here
    updates,
    {
      new: true,           // return the updated document
      runValidators: true, // run schema validators on update
    }
  );

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return task;
};

// Delete — again, both _id AND userId in the filter
const deleteTask = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, userId });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return task;
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };