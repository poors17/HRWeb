const express = require('express');
const authenticateToken = require('../middleware/auth');
const requireRoles = require('../middleware/roleCheck');
const {
  applyWfh,
  getMyWfhRequests,
  getPendingWfh,
  approveWfh,
  rejectWfh,
} = require('../controllers/wfhController');

const router = express.Router();
const approvalRoles = requireRoles('Manager', 'HR', 'Super Admin');

router.use(authenticateToken);
router.post('/apply', applyWfh);
router.get('/my', getMyWfhRequests);
router.get('/pending', approvalRoles, getPendingWfh);
router.patch('/:id/approve', approvalRoles, approveWfh);
router.patch('/:id/reject', approvalRoles, rejectWfh);

module.exports = router;