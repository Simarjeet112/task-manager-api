const catchAsync = require('../../utils/catchAsync');
const categoryService = require('./category.service');

exports.createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body.name, req.user.id);
  res.status(201).json({ status: 'success', data: { category } });
});

exports.getAllCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getAllCategories(req.user.id);
  res.status(200).json({ status: 'success', results: categories.length, data: { categories } });
});

exports.getCategoryById = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id, req.user.id);
  res.status(200).json({ status: 'success', data: { category } });
});

exports.updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.user.id, req.body.name);
  res.status(200).json({ status: 'success', data: { category } });
});

exports.deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id, req.user.id);
  res.status(204).json({ status: 'success', data: null });
});