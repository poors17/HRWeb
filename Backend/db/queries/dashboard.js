const pool = require('../../config/db');

async function getEmployeeCounts() {
  const result = await pool.query(
    `SELECT COUNT(*)::INTEGER AS total_employees,
            COUNT(*) FILTER (WHERE employment_status = 'Active')::INTEGER AS active_employees,
            COUNT(*) FILTER (WHERE employment_status = 'Inactive')::INTEGER AS inactive_employees,
            COUNT(*) FILTER (WHERE employment_status = 'Resigned')::INTEGER AS resigned_employees
     FROM employees`
  );
  return result.rows[0];
}

async function getTodayAttendanceCounts() {
  const result = await pool.query(
    `SELECT status, COUNT(*)::INTEGER AS count
     FROM attendance
     WHERE date = CURRENT_DATE
     GROUP BY status`
  );
  return result.rows;
}

async function getPendingRequestCounts() {
  const result = await pool.query(
    `SELECT
       (SELECT COUNT(*)::INTEGER FROM leave_requests WHERE status = 'Pending') AS pending_leave_requests,
       (SELECT COUNT(*)::INTEGER FROM exit_requests WHERE status <> 'Completed') AS pending_exit_requests`
  );
  return result.rows[0];
}

async function getDepartmentSummary() {
  const result = await pool.query(
    `SELECT d.name AS department_name, COUNT(e.id)::INTEGER AS employee_count
     FROM departments d
     LEFT JOIN employees e ON e.department_id = d.id
     GROUP BY d.id, d.name
     ORDER BY d.name`
  );
  return result.rows;
}

async function getLatestPayrollStatus() {
  const result = await pool.query(
    `SELECT month, year, status
     FROM payroll_runs
     ORDER BY year DESC, month DESC, id DESC
     LIMIT 1`
  );
  return result.rows[0] || null;
}

async function getOpenJobPostingsCount() {
  const result = await pool.query(
    "SELECT COUNT(*)::INTEGER AS count FROM job_postings WHERE status = 'Open'"
  );
  return result.rows[0].count;
}

module.exports = {
  getEmployeeCounts,
  getTodayAttendanceCounts,
  getPendingRequestCounts,
  getDepartmentSummary,
  getLatestPayrollStatus,
  getOpenJobPostingsCount,
};