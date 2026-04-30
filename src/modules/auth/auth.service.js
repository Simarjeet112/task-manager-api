const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../users/user.model');
const AppError = require('../../utils/AppError');

const signToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const register = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await createUser({ name, email, password: hashedPassword });
  const token = signToken(user.id);
  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  const isPasswordValid = user && (await bcrypt.compare(password, user.password));

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = signToken(user.id);
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
};

module.exports = { register, login };