const catchAsync = require('../../utils/catchAsync');
const authService = require('./auth.service');

exports.register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await authService.register({ name, email, password });

  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });

  res.status(200).json({
    status: 'success',
    token,
    data: { user },
  });
});