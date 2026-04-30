const Joi = require('joi');

exports.createCategorySchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
});

exports.updateCategorySchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
});