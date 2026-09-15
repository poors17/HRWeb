const {
  createEmployee: insertEmployee,
  getAllEmployees: findAllEmployees,
  getEmployeeById: findEmployeeById,
  updateEmployee: editEmployee,
  updateEmployeeStatus: setEmployeeStatus,
  transferEmployee: moveEmployee,
} = require('../db/queries/employees');
const logAction = require('../middleware/auditLogger');

const validStatuses = ['Active', 'Inactive', 'Resigned'];

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23505') return res.status(409).json({ message: 'A record with that value already exists' });
  if (error.code === '23503') return res.status(400).json({ message: 'A referenced record does not exist' });
  return res.status(500).json({ message });
}

async function createEmployee(req, res) {
  if (!req.body.full_name) return res.status(400).json({ message: 'full_name is required' });

  try {
    const employee = await insertEmployee(req.body);
    logAction(req, 'CREATE', 'Employee', employee.id, `Created employee ${employee.full_name}`);
    return res.status(201).json(employee);
  } catch (error) {
    return handleError(res, error, 'Unable to create employee');
  }
}

async function getAllEmployees(req, res) {
  try {
    const employees = await findAllEmployees(req.query);
    return res.json(employees);
  } catch (error) {
    return handleError(res, error, 'Unable to fetch employees');
  }
}

async function getEmployeeById(req, res) {
  try {
    const employee = await findEmployeeById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    return res.json(employee);
  } catch (error) {
    return handleError(res, error, 'Unable to fetch employee');
  }
}

async function updateEmployee(req, res) {
  try {
    const employee = await editEmployee(req.params.id, req.body);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    logAction(req, 'UPDATE', 'Employee', employee.id, `Updated employee ${employee.full_name}`);
    return res.json(employee);
  } catch (error) {
    return handleError(res, error, 'Unable to update employee');
  }
}

async function updateEmployeeStatus(req, res) {
  const { status } = req.body;
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'status must be Active, Inactive, or Resigned' });
  }

  try {
    const employee = await setEmployeeStatus(req.params.id, status);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    logAction(req, 'UPDATE', 'Employee', employee.id, `Changed employee status to ${status}`);
    return res.json(employee);
  } catch (error) {
    return handleError(res, error, 'Unable to update employee status');
  }
}

async function transferEmployee(req, res) {
  const { department_id: departmentId, designation_id: designationId } = req.body;
  if (!departmentId || !designationId) {
    return res.status(400).json({ message: 'department_id and designation_id are required' });
  }

  try {
    const employee = await moveEmployee(req.params.id, departmentId, designationId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    return res.json(employee);
  } catch (error) {
    return handleError(res, error, 'Unable to transfer employee');
  }
}

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
  transferEmployee,
};