const { findUserById } = require('./user.model');
const AppError = require('../../utils/AppError');

const getMe = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

module.exports = { getMe };