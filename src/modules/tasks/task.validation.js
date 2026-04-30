const Joi = require('joi');

exports.createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).optional(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.date().iso().optional(),
  category: Joi.string().optional(), // MongoDB ObjectId as string
  tags: Joi.array().items(Joi.string().max(50)).optional(),
});

exports.updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  description: Joi.string().max(1000).optional(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.date().iso().optional(),
  category: Joi.string().optional(),
  tags: Joi.array().items(Joi.string().max(50)).optional(),
}).min(1);

exports.filterTaskSchema = Joi.object({
  category: Joi.string().optional(),
  tags: Joi.string().optional(), // comma separated e.g. "bug,urgent"
  status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
});