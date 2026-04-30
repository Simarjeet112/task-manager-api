const catchAsync = require('../../utils/catchAsync');
const userService = require('./user.service');

exports.getMe = catchAsync(async (req, res) => {
  const user = await userService.getMe(req.user.id);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});