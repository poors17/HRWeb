const express = require('express');
const authenticateToken = require('../middleware/auth');
const requireRoles = require('../middleware/roleCheck');
const {
  punchIn,
  punchOut,
  getMyAttendance,
  getAttendanceByDate,
} = require('../controllers/attendanceController');

const router = express.Router();

router.use(authenticateToken);
router.post('/punch-in', punchIn);
router.post('/punch-out', punchOut);
router.get('/my', getMyAttendance);
router.get('/date/:date', requireRoles('HR', 'Manager', 'Super Admin'), getAttendanceByDate);

module.exports = router;