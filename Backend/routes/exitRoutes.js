const express = require('express');
const authenticateToken = require('../middleware/auth');
const requireRoles = require('../middleware/roleCheck');
const {
  submitExitRequest,
  getExitRequest,
  updateClearanceStatus,
  completeExit,
  getMyExitStatus,
} = require('../controllers/exitController');

const router = express.Router();
const exitAdminRoles = requireRoles('HR', 'Super Admin');

router.use(authenticateToken);
router.post('/request', submitExitRequest);
router.get('/my-status', getMyExitStatus);
router.get('/:id', getExitRequest);
router.patch('/:id/clearance', exitAdminRoles, updateClearanceStatus);
router.patch('/:id/complete', exitAdminRoles, completeExit);

module.exports = router;