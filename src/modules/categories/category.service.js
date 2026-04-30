const Category = require('./category.model');
const AppError = require('../../utils/AppError');

const createCategory = async (name, userId) => {
  try {
    const category = await Category.create({ name, userId });
    return category;
  } catch (err) {
    // MongoDB duplicate key error
    if (err.code === 11000) {
      throw new AppError('You already have a category with that name.', 409);
    }
    throw err;
  }
};

const getAllCategories = async (userId) => {
  return await Category.find({ userId }).sort({ name: 1 });
};

const getCategoryById = async (id, userId) => {
  const category = await Category.findOne({ _id: id, userId });
  if (!category) throw new AppError('Category not found', 404);
  return category;
};

const updateCategory = async (id, userId, name) => {
  const category = await Category.findOneAndUpdate(
    { _id: id, userId },
    { name },
    { new: true, runValidators: true }
  );
  if (!category) throw new AppError('Category not found', 404);
  return category;
};

const deleteCategory = async (id, userId) => {
  const category = await Category.findOneAndDelete({ _id: id, userId });
  if (!category) throw new AppError('Category not found', 404);
  return category;
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};