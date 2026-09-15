const express = require('express');
const authenticateToken = require('../middleware/auth');
const requireRoles = require('../middleware/roleCheck');
const {
  getEmployeeReport,
  getAttendanceReport,
  getLeaveReport,
  getPayrollReport,
  getDocumentExpiryReport,
  getRecruitmentReport,
  getAssetReport,
  getPerformanceReport,
} = require('../controllers/reportController');

const router = express.Router();
const reportRoles = requireRoles('HR', 'Manager', 'Finance/Payroll', 'Management', 'Super Admin');

router.use(authenticateToken, reportRoles);
router.get('/employees', getEmployeeReport);
router.get('/attendance', getAttendanceReport);
router.get('/leave', getLeaveReport);
router.get('/payroll', getPayrollReport);
router.get('/document-expiry', getDocumentExpiryReport);
router.get('/recruitment', getRecruitmentReport);
router.get('/assets', getAssetReport);
router.get('/performance', getPerformanceReport);

module.exports = router;