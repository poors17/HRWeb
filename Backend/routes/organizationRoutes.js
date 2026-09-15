const express = require('express');
const authenticateToken = require('../middleware/auth');
const {
  createDepartment,
  getAllDepartments,
  createDesignation,
  getAllDesignations,
  createBranch,
  getAllBranches,
  createShift,
  getAllShifts,
} = require('../controllers/organizationController');

const router = express.Router();

router.use(authenticateToken);
router.post('/departments', createDepartment);
router.get('/departments', getAllDepartments);
router.post('/designations', createDesignation);
router.get('/designations', getAllDesignations);
router.post('/branches', createBranch);
router.get('/branches', getAllBranches);
router.post('/shifts', createShift);
router.get('/shifts', getAllShifts);

module.exports = router;