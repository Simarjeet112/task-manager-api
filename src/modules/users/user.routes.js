const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth.middleware');

router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user },
  });
});

module.exports = router;