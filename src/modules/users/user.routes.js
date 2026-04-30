const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth.middleware');
const userController = require('./user.controller');

router.get('/me', authMiddleware, userController.getMe);

module.exports = router;