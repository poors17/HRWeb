const pool = require('../../config/db');

async function createPermissionRequest({ employeeId, date, fromTime, toTime, reason }) {
  const result = await pool.query(
    `INSERT INTO permission_requests (employee_id, date, from_time, to_time, reason)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [employeeId, date, fromTime, toTime, reason || null]
  );
  return result.rows[0];
}

async function getPermissionRequestsByEmployee(employeeId) {
  const result = await pool.query(
    `SELECT pr.*, e.employee_code, e.full_name
     FROM permission_requests pr
     LEFT JOIN employees e ON e.id = pr.employee_id
     WHERE pr.employee_id = $1
     ORDER BY pr.date DESC, pr.created_at DESC`,
    [employeeId]
  );
  return result.rows;
}

async function getPendingPermissionRequests() {
  const result = await pool.query(
    `SELECT pr.*, e.employee_code, e.full_name
     FROM permission_requests pr
     LEFT JOIN employees e ON e.id = pr.employee_id
     WHERE pr.status = 'Pending'
     ORDER BY pr.date, pr.created_at ASC`
  );
  return result.rows;
}

async function getPermissionRequestById(id) {
  const result = await pool.query('SELECT * FROM permission_requests WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function updatePermissionStatus(id, status, approvedBy) {
  const result = await pool.query(
    `UPDATE permission_requests
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
  createPermissionRequest,
  getPermissionRequestsByEmployee,
  getPendingPermissionRequests,
  getPermissionRequestById,
  updatePermissionStatus,
  getEmployeeIdByUserId,
};