const pool = require('../../config/db');

async function getEmployeeReportData() {
  const result = await pool.query(
    `SELECT e.id, e.employee_code, e.full_name, e.personal_email, e.mobile_number,
            d.name AS department_name, dg.name AS designation_name,
            e.employment_status, e.date_of_joining
     FROM employees e
     LEFT JOIN departments d ON d.id = e.department_id
     LEFT JOIN designations dg ON dg.id = e.designation_id
     ORDER BY e.id`
  );
  return result.rows;
}

async function getAttendanceReportData(month, year) {
  const result = await pool.query(
    `SELECT e.id AS employee_id, e.employee_code, e.full_name,
            d.name AS department_name,
            COUNT(a.id)::INTEGER AS recorded_days,
            COUNT(a.id) FILTER (WHERE a.status = 'Present')::INTEGER AS present_days,
            COUNT(a.id) FILTER (WHERE a.status = 'Absent')::INTEGER AS absent_days,
            COUNT(a.id) FILTER (WHERE a.status = 'Late')::INTEGER AS late_days,
            COUNT(a.id) FILTER (WHERE a.status = 'Half-Day')::INTEGER AS half_day_days,
            COUNT(a.id) FILTER (WHERE a.status = 'WFH')::INTEGER AS wfh_days,
            COALESCE(SUM(a.working_hours), 0)::NUMERIC AS working_hours
     FROM employees e
     LEFT JOIN departments d ON d.id = e.department_id
     LEFT JOIN attendance a ON a.employee_id = e.id
       AND EXTRACT(MONTH FROM a.date) = $1
       AND EXTRACT(YEAR FROM a.date) = $2
     GROUP BY e.id, e.employee_code, e.full_name, d.name
     ORDER BY e.full_name`,
    [month, year]
  );
  return result.rows;
}

async function getLeaveReportData(filters = {}) {
  const conditions = [];
  const values = [];
  if (filters.status) {
    values.push(filters.status);
    conditions.push(`lr.status = $${values.length}`);
  }
  if (filters.employeeId) {
    values.push(filters.employeeId);
    conditions.push(`lr.employee_id = $${values.length}`);
  }
  if (filters.startDate) {
    values.push(filters.startDate);
    conditions.push(`lr.start_date >= $${values.length}::date`);
  }
  if (filters.endDate) {
    values.push(filters.endDate);
    conditions.push(`lr.end_date <= $${values.length}::date`);
  }

  const result = await pool.query(
    `SELECT lr.id, e.employee_code, e.full_name, lt.name AS leave_type,
            lr.start_date, lr.end_date, lr.total_days, lr.status, lr.reason,
            COALESCE(lb.total_days, 0) AS balance_total_days,
            COALESCE(lb.used_days, 0) AS balance_used_days,
            COALESCE(lb.total_days - lb.used_days, 0) AS balance_remaining_days
     FROM leave_requests lr
     JOIN employees e ON e.id = lr.employee_id
     JOIN leave_types lt ON lt.id = lr.leave_type_id
     LEFT JOIN leave_balances lb ON lb.employee_id = lr.employee_id
       AND lb.leave_type_id = lr.leave_type_id
       AND lb.year = EXTRACT(YEAR FROM lr.start_date)::INTEGER
     ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
     ORDER BY lr.start_date DESC, lr.id DESC`,
    values
  );
  return result.rows;
}

async function getPayrollReportData(payrollRunId) {
  const result = await pool.query(
    `SELECT pr.month, pr.year, pr.status AS payroll_status,
            e.employee_code, e.full_name, d.name AS department_name,
            p.basic_salary, p.hra, p.other_allowances, p.gross_salary,
            p.pf_deduction, p.esi_deduction, p.professional_tax, p.tds,
            p.loss_of_pay_days, p.loss_of_pay_amount, p.total_deductions, p.net_salary
     FROM payslips p
     JOIN payroll_runs pr ON pr.id = p.payroll_run_id
     JOIN employees e ON e.id = p.employee_id
     LEFT JOIN departments d ON d.id = e.department_id
     WHERE p.payroll_run_id = $1
     ORDER BY e.full_name`,
    [payrollRunId]
  );
  return result.rows;
}

async function getDocumentExpiryReportData(daysAhead) {
  const result = await pool.query(
    `SELECT ed.id, e.employee_code, e.full_name, dc.name AS category_name,
            ed.file_name, ed.file_url, ed.issue_date, ed.expiry_date,
            ed.verification_status,
            CASE WHEN ed.expiry_date < CURRENT_DATE THEN 'Expired' ELSE 'Expiring' END AS expiry_status
     FROM employee_documents ed
     JOIN employees e ON e.id = ed.employee_id
     LEFT JOIN document_categories dc ON dc.id = ed.category_id
     WHERE ed.expiry_date IS NOT NULL
       AND ed.expiry_date <= CURRENT_DATE + ($1 * INTERVAL '1 day')
     ORDER BY ed.expiry_date, e.full_name`,
    [daysAhead]
  );
  return result.rows;
}

async function getRecruitmentReportData() {
  const result = await pool.query(
    `SELECT jp.id AS job_posting_id, jp.title AS job_title, jp.status AS job_status,
            c.status AS candidate_stage, COUNT(c.id)::INTEGER AS candidate_count
     FROM job_postings jp
     LEFT JOIN candidates c ON c.job_posting_id = jp.id
     GROUP BY jp.id, jp.title, jp.status, c.status
     ORDER BY jp.created_at DESC, c.status`
  );
  return result.rows;
}

async function getAssetReportData() {
  const result = await pool.query(
    `SELECT a.status, COUNT(a.id)::INTEGER AS asset_count,
            COUNT(a.id) FILTER (WHERE aa.returned_date IS NOT NULL)::INTEGER AS returned_count
     FROM assets a
     LEFT JOIN asset_assignments aa ON aa.asset_id = a.id
     GROUP BY a.status
     ORDER BY a.status`
  );
  return result.rows;
}

async function getPerformanceReportData(cycleId) {
  const result = await pool.query(
    `SELECT pc.name AS cycle_name, pc.start_date, pc.end_date,
            e.employee_code, e.full_name,
            pg.title AS goal_title, pg.target, pg.weightage,
            pr.self_review, pr.manager_review, pr.rating, pr.final_outcome, pr.status AS review_status
     FROM performance_cycles pc
     LEFT JOIN performance_goals pg ON pg.cycle_id = pc.id
     LEFT JOIN employees e ON e.id = COALESCE(pg.employee_id, (SELECT employee_id FROM performance_reviews WHERE cycle_id = pc.id LIMIT 1))
     LEFT JOIN performance_reviews pr ON pr.cycle_id = pc.id AND pr.employee_id = e.id
     WHERE pc.id = $1
     ORDER BY e.full_name, pg.id`,
    [cycleId]
  );
  return result.rows;
}

module.exports = {
  getEmployeeReportData,
  getAttendanceReportData,
  getLeaveReportData,
  getPayrollReportData,
  getDocumentExpiryReportData,
  getRecruitmentReportData,
  getAssetReportData,
  getPerformanceReportData,
};