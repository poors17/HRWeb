const express = require('express');
const {
  signup,
  login,
  refreshToken,
  logout,
} = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');
const requireRoles = require('../middleware/roleCheck');

const router = express.Router();

router.post('/signup', authenticateToken, requireRoles('Super Admin'), signup);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticateToken, logout);

module.exports = router;