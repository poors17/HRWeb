const pool = require('../../config/db');

async function createExitRequest({ employeeId, resignationDate, lastWorkingDate, noticePeriodDays, reason }) {
  const result = await pool.query(
    `INSERT INTO exit_requests
       (employee_id, resignation_date, last_working_date, notice_period_days, reason)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [employeeId, resignationDate, lastWorkingDate || null, noticePeriodDays ?? null, reason || null]
  );
  return result.rows[0];
}

async function getExitRequestById(id) {
  const result = await pool.query(
    `SELECT er.*, e.employee_code, e.full_name
     FROM exit_requests er
     JOIN employees e ON e.id = er.employee_id
     WHERE er.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function updateExitStatus(id, status, notes) {
  const result = await pool.query(
    `UPDATE exit_requests
     SET status = $1, exit_interview_notes = COALESCE($2, exit_interview_notes), updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [status, notes || null, id]
  );
  return result.rows[0] || null;
}

async function createClearanceRecord({ exitRequestId, clearanceType, clearedBy }) {
  const result = await pool.query(
    `INSERT INTO exit_clearances (exit_request_id, clearance_type, cleared_by)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [exitRequestId, clearanceType, clearedBy]
  );
  return result.rows[0];
}

async function updateClearance(exitRequestId, clearanceType, isCleared, remarks, clearedBy) {
  const result = await pool.query(
    `INSERT INTO exit_clearances
       (exit_request_id, clearance_type, cleared_by, is_cleared, remarks, cleared_at)
     VALUES ($1, $2, $3, $4, $5, CASE WHEN $4 THEN NOW() ELSE NULL END)
     RETURNING *`,
    [exitRequestId, clearanceType, clearedBy, isCleared, remarks || null]
  );
  return result.rows[0];
}

async function getClearancesByExitRequest(exitRequestId) {
  const result = await pool.query(
    `SELECT ec.*, u.name AS cleared_by_name
     FROM exit_clearances ec
     LEFT JOIN users u ON u.id = ec.cleared_by
     WHERE ec.exit_request_id = $1
     ORDER BY ec.id`,
    [exitRequestId]
  );
  return result.rows;
}

async function getMyExitRequest(employeeId) {
  const result = await pool.query(
    `SELECT er.*, COALESCE(json_agg(ec ORDER BY ec.id) FILTER (WHERE ec.id IS NOT NULL), '[]') AS clearances
     FROM exit_requests er
     LEFT JOIN exit_clearances ec ON ec.exit_request_id = er.id
     WHERE er.employee_id = $1
     GROUP BY er.id
     ORDER BY er.created_at DESC
     LIMIT 1`,
    [employeeId]
  );
  return result.rows[0] || null;
}

async function getEmployeeIdByUserId(userId) {
  const result = await pool.query('SELECT id FROM employees WHERE user_id = $1', [userId]);
  return result.rows[0]?.id || null;
}

module.exports = {
  createExitRequest,
  getExitRequestById,
  updateExitStatus,
  createClearanceRecord,
  updateClearance,
  getClearancesByExitRequest,
  getMyExitRequest,
  getEmployeeIdByUserId,
};