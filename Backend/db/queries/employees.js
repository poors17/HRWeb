const pool = require('../../config/db');

const employeeFields = [
  'full_name', 'date_of_birth', 'gender', 'mobile_number', 'personal_email',
  'current_address', 'permanent_address', 'emergency_contact_name',
  'emergency_contact_number', 'date_of_joining', 'employment_type',
  'department_id', 'designation_id', 'reporting_manager_id', 'branch_id',
  'shift_id', 'employment_status', 'bank_account_number', 'bank_ifsc', 'bank_name',
];

async function generateNextEmployeeCode() {
  const result = await pool.query(
    `SELECT COALESCE(MAX(SUBSTRING(employee_code FROM 4)::INTEGER), 0) + 1 AS next_number
     FROM employees
     WHERE employee_code ~ '^EMP[0-9]+$'`
  );

  return `EMP${String(result.rows[0].next_number).padStart(3, '0')}`;
}

async function createEmployee(data) {
  const employeeCode = data.employee_code || await generateNextEmployeeCode();
  const fields = ['employee_code', 'user_id', ...employeeFields];
  const values = [employeeCode, data.user_id || null, ...employeeFields.map((field) => data[field] ?? null)];
  const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
  const result = await pool.query(
    `INSERT INTO employees (${fields.join(', ')})
     VALUES (${placeholders})
     RETURNING *`,
    values
  );

  return result.rows[0];
}

async function getAllEmployees(filters = {}) {
  const conditions = [];
  const values = [];

  for (const field of ['department_id', 'branch_id', 'employment_status']) {
    if (filters[field] !== undefined && filters[field] !== '') {
      values.push(filters[field]);
      conditions.push(`e.${field} = $${values.length}`);
    }
  }

  const result = await pool.query(
    `SELECT e.*, d.name AS department_name, dg.name AS designation_name,
            b.name AS branch_name, s.name AS shift_name
     FROM employees e
     LEFT JOIN departments d ON d.id = e.department_id
     LEFT JOIN designations dg ON dg.id = e.designation_id
     LEFT JOIN branches b ON b.id = e.branch_id
     LEFT JOIN shifts s ON s.id = e.shift_id
     ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
     ORDER BY e.id`,
    values
  );

  return result.rows;
}

async function getEmployeeById(id) {
  const result = await pool.query(
    `SELECT e.*, d.name AS department_name, dg.name AS designation_name,
            b.name AS branch_name, s.name AS shift_name
     FROM employees e
     LEFT JOIN departments d ON d.id = e.department_id
     LEFT JOIN designations dg ON dg.id = e.designation_id
     LEFT JOIN branches b ON b.id = e.branch_id
     LEFT JOIN shifts s ON s.id = e.shift_id
     WHERE e.id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

async function updateEmployee(id, data) {
  const updates = employeeFields.filter((field) => data[field] !== undefined);
  if (!updates.length) return getEmployeeById(id);

  const values = updates.map((field) => data[field]);
  values.push(id);
  const setClause = updates.map((field, index) => `${field} = $${index + 1}`).join(', ');
  const result = await pool.query(
    `UPDATE employees SET ${setClause}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  return result.rows[0] || null;
}

async function updateEmployeeStatus(id, status) {
  const result = await pool.query(
    `UPDATE employees SET employment_status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );

  return result.rows[0] || null;
}

async function transferEmployee(id, departmentId, designationId) {
  const result = await pool.query(
    `UPDATE employees
     SET department_id = $1, designation_id = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [departmentId, designationId, id]
  );

  return result.rows[0] || null;
}

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
  transferEmployee,
  generateNextEmployeeCode,
};