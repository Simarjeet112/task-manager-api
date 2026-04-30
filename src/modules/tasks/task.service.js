const Task = require('./task.model');
const AppError = require('../../utils/AppError');
const { scheduleReminder, cancelReminder } = require('../../queues/reminder.scheduler');
const { sendTaskCompletedWebhook } = require('../../services/webhook.service');

const createTask = async (taskData, userId) => {
  const task = await Task.create({ ...taskData, userId });

  if (task.dueDate) {
    try {
      await scheduleReminder(task);
      await Task.findByIdAndUpdate(task._id, { reminderScheduled: true });
    } catch (err) {
      console.error('scheduleReminder ERROR:', err.message);
    }
  }

  return task;
};

const getAllTasks = async (userId, filters = {}) => {
  const query = { userId };

  if (filters.category) query.category = filters.category;
  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.tags) {
    const tagArray = filters.tags.split(',').map((t) => t.trim());
    query.tags = { $in: tagArray };
  }

  const tasks = await Task.find(query)
    .populate('category', 'name')
    .sort({ createdAt: -1 });

  return tasks;
};

const getTaskById = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId }).populate('category', 'name');
  if (!task) throw new AppError('Task not found', 404);
  return task;
};

const updateTask = async (taskId, userId, updates) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId },
    updates,
    { new: true, runValidators: true }
  ).populate('category', 'name');

  if (!task) throw new AppError('Task not found', 404);

  // Reschedule reminder if dueDate updated
  if (updates.dueDate) {
    try {
      await scheduleReminder(task);
      await Task.findByIdAndUpdate(task._id, { reminderScheduled: true });
    } catch (err) {
      console.error('scheduleReminder ERROR:', err.message);
    }
  }

  // Trigger webhook if task marked completed
  if (updates.status === 'completed') {
    await cancelReminder(taskId);
    await Task.findByIdAndUpdate(task._id, { reminderScheduled: false });
    sendTaskCompletedWebhook(task); // fire and forget
  }

  return task;
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, userId });
  if (!task) throw new AppError('Task not found', 404);
  await cancelReminder(taskId);
  return task;
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };