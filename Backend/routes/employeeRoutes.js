const express = require('express');
const authenticateToken = require('../middleware/auth');
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
  transferEmployee,
} = require('../controllers/employeeController');

const router = express.Router();

router.use(authenticateToken);
router.post('/', createEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.patch('/:id/status', updateEmployeeStatus);
router.patch('/:id/transfer', transferEmployee);

module.exports = router;