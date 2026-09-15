const express = require('express');
const authenticateToken = require('../middleware/auth');
const requireRoles = require('../middleware/roleCheck');
const {
  createProgram,
  getPrograms,
  enroll,
  updateEnrollmentStatus,
  getMyEnrollments,
} = require('../controllers/trainingController');

const router = express.Router();
const managementRoles = requireRoles('HR', 'Manager', 'Super Admin');

router.use(authenticateToken);
router.post('/programs', managementRoles, createProgram);
router.get('/programs', getPrograms);
router.post('/enroll', enroll);
router.patch('/enrollments/:id/status', updateEnrollmentStatus);
router.get('/my-enrollments', getMyEnrollments);

module.exports = router;