const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const categoryController = require('./category.controller');
const { createCategorySchema, updateCategorySchema } = require('./category.validation');

router.use(authMiddleware);

router.route('/')
  .get(categoryController.getAllCategories)
  .post(validate(createCategorySchema), categoryController.createCategory);

router.route('/:id')
  .get(categoryController.getCategoryById)
  .put(validate(updateCategorySchema), categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;