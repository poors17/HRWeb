const express = require('express');
const authenticateToken = require('../middleware/auth');
const requireRoles = require('../middleware/roleCheck');
const {
  setSalaryStructure,
  getSalaryStructure,
  runPayroll,
  getPayrollRuns,
  getPayslip,
  getMyPayslips,
} = require('../controllers/payrollController');

const router = express.Router();
const payrollRoles = requireRoles('Super Admin', 'Finance/Payroll');

router.use(authenticateToken);
router.post('/salary-structure', payrollRoles, setSalaryStructure);
router.get('/salary-structure/:employeeId', payrollRoles, getSalaryStructure);
router.post('/run', payrollRoles, runPayroll);
router.get('/runs', getPayrollRuns);
router.get('/payslip/:employeeId/:payrollRunId', getPayslip);
router.get('/my-payslips', getMyPayslips);

module.exports = router;