const express = require('express');
const authenticateToken = require('../middleware/auth');
const requireRoles = require('../middleware/roleCheck');
const { getLogs } = require('../controllers/auditLogController');

const router = express.Router();

router.use(authenticateToken);
router.get('/', requireRoles('Super Admin'), getLogs);

module.exports = router;