const pool = require('../../config/db');

async function createWfhRequest({ employeeId, startDate, endDate, reason }) {
  const result = await pool.query(
    `INSERT INTO wfh_requests (employee_id, start_date, end_date, reason)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [employeeId, startDate, endDate, reason || null]
  );
  return result.rows[0];
}

async function getWfhRequestsByEmployee(employeeId) {
  const result = await pool.query(
    `SELECT wr.*, e.employee_code, e.full_name
     FROM wfh_requests wr
     LEFT JOIN employees e ON e.id = wr.employee_id
     WHERE wr.employee_id = $1
     ORDER BY wr.created_at DESC`,
    [employeeId]
  );
  return result.rows;
}

async function getPendingWfhRequests() {
  const result = await pool.query(
    `SELECT wr.*, e.employee_code, e.full_name
     FROM wfh_requests wr
     LEFT JOIN employees e ON e.id = wr.employee_id
     WHERE wr.status = 'Pending'
     ORDER BY wr.created_at ASC`
  );
  return result.rows;
}

async function getWfhRequestById(id) {
  const result = await pool.query(
    `SELECT wr.*, e.user_id
     FROM wfh_requests wr
     LEFT JOIN employees e ON e.id = wr.employee_id
     WHERE wr.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function updateWfhStatus(id, status, approvedBy) {
  const result = await pool.query(
    `UPDATE wfh_requests
     SET status = $1, approved_by = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [status, approvedBy, id]
  );
  return result.rows[0] || null;
}

async function getEmployeeIdByUserId(userId) {
  const result = await pool.query('SELECT id FROM employees WHERE user_id = $1', [userId]);
  return result.rows[0]?.id || null;
}

module.exports = {
  createWfhRequest,
  getWfhRequestsByEmployee,
  getPendingWfhRequests,
  getWfhRequestById,
  updateWfhStatus,
  getEmployeeIdByUserId,
};