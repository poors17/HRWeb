const pool = require('../../config/db');

async function getEmployeeIdByUserId(userId) {
  const result = await pool.query('SELECT id FROM employees WHERE user_id = $1', [userId]);
  return result.rows[0]?.id || null;
}

async function createLeaveRequest(data) {
  const result = await pool.query(
    `INSERT INTO leave_requests
       (employee_id, leave_type_id, start_date, end_date, total_days, reason, handover_employee_id, contact_number)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      data.employeeId,
      data.leaveTypeId,
      data.startDate,
      data.endDate,
      data.totalDays,
      data.reason || null,
      data.handoverEmployeeId || null,
      data.contactNumber || null,
    ]
  );
  return result.rows[0];
}

async function getLeaveRequestsByEmployee(employeeId) {
  const result = await pool.query(
    `SELECT lr.*,
            lt.name AS leave_type_name,
            emp.full_name AS employee_name,
            emp.employee_code,
            manager.full_name AS reporting_manager_name,
            manager.employee_code AS reporting_manager_code,
            handover.full_name AS handover_employee_name,
            handover.employee_code AS handover_employee_code,
            approver_user.name AS approver_name,
            approver_emp.full_name AS approver_employee_name,
            approver_emp.employee_code AS approver_employee_code
     FROM leave_requests lr
     LEFT JOIN leave_types lt ON lt.id = lr.leave_type_id
     LEFT JOIN employees emp ON emp.id = lr.employee_id
     LEFT JOIN employees manager ON manager.id = emp.reporting_manager_id
     LEFT JOIN employees handover ON handover.id = lr.handover_employee_id
     LEFT JOIN users approver_user ON approver_user.id = lr.approved_by
     LEFT JOIN employees approver_emp ON approver_emp.user_id = approver_user.id
     WHERE lr.employee_id = $1
     ORDER BY lr.created_at DESC`,
    [employeeId]
  );
  return result.rows;
}

async function getPendingLeaveRequests() {
  const result = await pool.query(
    `SELECT lr.*, lt.name AS leave_type_name, e.employee_code, e.full_name
     FROM leave_requests lr
     LEFT JOIN leave_types lt ON lt.id = lr.leave_type_id
     LEFT JOIN employees e ON e.id = lr.employee_id
     WHERE lr.status IN ('Pending', 'Manager Approved')
     ORDER BY lr.created_at ASC`
  );
  return result.rows;
}

async function getLeaveRequestById(id) {
  const result = await pool.query(
    `SELECT lr.*, e.user_id
     FROM leave_requests lr
     LEFT JOIN employees e ON e.id = lr.employee_id
     WHERE lr.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function updateLeaveRequestStatus(id, status, approvedBy) {
  const result = await pool.query(
    `UPDATE leave_requests
     SET status = $1, approved_by = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [status, approvedBy, id]
  );
  return result.rows[0] || null;
}

async function getLeaveTypes() {
  const result = await pool.query(
    `SELECT id, name AS leave_type_name, default_days_per_year AS total_days
     FROM leave_types
     ORDER BY name`,
    []
  );
  return result.rows;
}

async function ensureLeaveBalancesForEmployee(employeeId, year) {
  const result = await pool.query(
    `INSERT INTO leave_balances (employee_id, leave_type_id, year, total_days, used_days)
     SELECT $1, lt.id, $2, lt.default_days_per_year, 0
     FROM leave_types lt
     LEFT JOIN leave_balances lb
       ON lb.employee_id = $1 AND lb.leave_type_id = lt.id AND lb.year = $2
     WHERE lb.id IS NULL
     ON CONFLICT (employee_id, leave_type_id, year) DO NOTHING`,
    [employeeId, year]
  );
  return result.rowCount || 0;
}

async function getLeaveBalance(employeeId, year) {
  const result = await pool.query(
    `SELECT lb.*, lt.name AS leave_type_name, lt.default_days_per_year
     FROM leave_balances lb
     JOIN leave_types lt ON lt.id = lb.leave_type_id
     WHERE lb.employee_id = $1 AND lb.year = $2
     ORDER BY lt.name`,
    [employeeId, year]
  );
  return result.rows;
}

async function deductLeaveBalance(employeeId, leaveTypeId, year, days) {
  const result = await pool.query(
    `UPDATE leave_balances
     SET used_days = used_days + $4
     WHERE employee_id = $1 AND leave_type_id = $2 AND year = $3
       AND used_days + $4 <= total_days
     RETURNING *`,
    [employeeId, leaveTypeId, year, days]
  );
  return result.rows[0] || null;
}

async function restoreLeaveBalance(employeeId, leaveTypeId, year, days) {
  const result = await pool.query(
    `UPDATE leave_balances
     SET used_days = GREATEST(used_days - $4, 0)
     WHERE employee_id = $1 AND leave_type_id = $2 AND year = $3
     RETURNING *`,
    [employeeId, leaveTypeId, year, days]
  );
  return result.rows[0] || null;
}

module.exports = {
  getEmployeeIdByUserId,
  createLeaveRequest,
  getLeaveRequestsByEmployee,
  getPendingLeaveRequests,
  getLeaveRequestById,
  updateLeaveRequestStatus,
  getLeaveTypes,
  ensureLeaveBalancesForEmployee,
  getLeaveBalance,
  deductLeaveBalance,
  restoreLeaveBalance,
};