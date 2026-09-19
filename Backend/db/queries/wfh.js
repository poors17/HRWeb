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
    `SELECT wr.*, e.employee_code, e.full_name,
            l1.user_id AS level1_manager_user_id,
            l2.user_id AS level2_manager_user_id
     FROM wfh_requests wr
     LEFT JOIN employees e ON e.id = wr.employee_id
     LEFT JOIN employees l1 ON l1.id = e.reporting_manager_id
     LEFT JOIN employees l2 ON l2.id = e.level2_manager_id
     WHERE wr.status = 'Pending'
     ORDER BY wr.created_at ASC`
  );
  return result.rows;
}

async function getWfhRequestById(id) {
  const result = await pool.query(
    `SELECT wr.*, e.user_id,
            e.reporting_manager_id, e.level2_manager_id,
            l1.user_id AS level1_manager_user_id,
            l2.user_id AS level2_manager_user_id
     FROM wfh_requests wr
     LEFT JOIN employees e ON e.id = wr.employee_id
     LEFT JOIN employees l1 ON l1.id = e.reporting_manager_id
     LEFT JOIN employees l2 ON l2.id = e.level2_manager_id
     WHERE wr.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function updateWfhStage(id, stage, status, approvedBy) {
  const stageColumns = {
    level1: ['level1_status', 'level1_approved_by', 'level1_approved_at'],
    level2: ['level2_status', 'level2_approved_by', 'level2_approved_at'],
    hr: ['hr_status', 'hr_approved_by', 'hr_approved_at'],
  };
  const columns = stageColumns[stage];
  if (!columns) throw new Error('Invalid WFH approval stage');

  const result = await pool.query(
    `UPDATE wfh_requests
     SET ${columns[0]} = $1,
         ${columns[1]} = $2,
         ${columns[2]} = NOW(),
         approved_by = CASE WHEN $1 = 'Approved' THEN $2 ELSE approved_by END,
         updated_at = NOW()
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
  updateWfhStage,
  getEmployeeIdByUserId,
};