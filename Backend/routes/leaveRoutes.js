const express = require('express');
const authenticateToken = require('../middleware/auth');
const requireRoles = require('../middleware/roleCheck');
const {
  applyLeave,
  getMyLeaveRequests,
  getPendingApprovals,
  approveLeave,
  rejectLeave,
  getLeaveBalance,
} = require('../controllers/leaveController');

const router = express.Router();

router.use(authenticateToken);
router.post('/apply', applyLeave);
router.get('/my', getMyLeaveRequests);
router.get('/pending', requireRoles('HR', 'Manager', 'Super Admin'), getPendingApprovals);
router.patch('/:id/approve', requireRoles('HR', 'Manager', 'Super Admin'), approveLeave);
router.patch('/:id/reject', requireRoles('HR', 'Manager', 'Super Admin'), rejectLeave);
router.get('/balance', getLeaveBalance);

module.exports = router;