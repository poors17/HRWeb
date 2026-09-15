const express = require('express');
const authenticateToken = require('../middleware/auth');
const requireRoles = require('../middleware/roleCheck');
const {
  applyPermission,
  getMyPermissionRequests,
  getPendingPermission,
  approvePermission,
  rejectPermission,
} = require('../controllers/permissionController');

const router = express.Router();
const approvalRoles = requireRoles('Manager', 'HR', 'Super Admin');

router.use(authenticateToken);
router.post('/apply', applyPermission);
router.get('/my', getMyPermissionRequests);
router.get('/pending', approvalRoles, getPendingPermission);
router.patch('/:id/approve', approvalRoles, approvePermission);
router.patch('/:id/reject', approvalRoles, rejectPermission);

module.exports = router;