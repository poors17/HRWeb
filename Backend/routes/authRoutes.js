const express = require('express');
const {
  signup,
  login,
  refreshToken,
  logout,
} = require('../controllers/authController');
const { countUsers } = require('../db/queries/users');
const authenticateToken = require('../middleware/auth');
const requireRoles = require('../middleware/roleCheck');

const router = express.Router();

async function bootstrapOrRequireSuperAdmin(req, res, next) {
  const userCount = await countUsers();

  if (userCount === 0) {
    return next();
  }

  return authenticateToken(req, res, () => requireRoles('Super Admin')(req, res, next));
}

router.post('/signup', bootstrapOrRequireSuperAdmin, signup);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticateToken, logout);

module.exports = router;