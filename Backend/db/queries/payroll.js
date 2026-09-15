const pool = require('../../config/db');

const salaryFields = [
  'basic_salary', 'hra', 'other_allowances', 'pf_deduction', 'esi_deduction',
  'professional_tax', 'tds', 'effective_from',
];

async function createSalaryStructure(data, db = pool) {
  const result = await db.query(
    `INSERT INTO salary_structures
       (employee_id, basic_salary, hra, other_allowances, pf_deduction,
        esi_deduction, professional_tax, tds, effective_from)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      data.employeeId,
      data.basicSalary,
      data.hra ?? 0,
      data.otherAllowances ?? 0,
      data.pfDeduction ?? 0,
      data.esiDeduction ?? 0,
      data.professionalTax ?? 0,
      data.tds ?? 0,
      data.effectiveFrom,
    ]
  );
  return result.rows[0];
}

async function getSalaryStructureByEmployee(employeeId, db = pool) {
  const result = await db.query(
    `SELECT ss.*, e.employee_code, e.full_name
     FROM salary_structures ss
     JOIN employees e ON e.id = ss.employee_id
     WHERE ss.employee_id = $1`,
    [employeeId]
  );
  return result.rows[0] || null;
}

async function updateSalaryStructure(employeeId, data, db = pool) {
  const updates = salaryFields.filter((field) => data[field] !== undefined);
  const values = updates.map((field) => data[field]);
  if (!updates.length) return getSalaryStructureByEmployee(employeeId, db);

  values.push(employeeId);
  const setClause = updates
    .map((field, index) => `${field} = $${index + 1}`)
    .concat('updated_at = NOW()')
    .join(', ');
  const result = await db.query(
    `UPDATE salary_structures
     SET ${setClause}
     WHERE employee_id = $${values.length}
     RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

async function createPayrollRun(month, year, processedBy, db = pool) {
  const result = await db.query(
    `INSERT INTO payroll_runs (month, year, processed_by)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [month, year, processedBy]
  );
  return result.rows[0];
}

async function getPayrollRunByMonthYear(month, year, db = pool) {
  const result = await db.query(
    'SELECT * FROM payroll_runs WHERE month = $1 AND year = $2',
    [month, year]
  );
  return result.rows[0] || null;
}

async function getPayrollRuns(db = pool) {
  const result = await db.query(
    `SELECT pr.*, u.name AS processed_by_name,
            COUNT(p.id)::INTEGER AS payslip_count
     FROM payroll_runs pr
     LEFT JOIN users u ON u.id = pr.processed_by
     LEFT JOIN payslips p ON p.payroll_run_id = pr.id
     GROUP BY pr.id, u.name
     ORDER BY pr.year DESC, pr.month DESC`
  );
  return result.rows;
}

async function getActiveEmployees(db = pool) {
  const result = await db.query(
    `SELECT e.id, e.user_id, e.employee_code, e.full_name, ss.*
     FROM employees e
     LEFT JOIN salary_structures ss ON ss.employee_id = e.id
     WHERE e.employment_status = 'Active'
     ORDER BY e.id`
  );
  return result.rows;
}

async function getEmployeeIdByUserId(userId, db = pool) {
  const result = await db.query('SELECT id FROM employees WHERE user_id = $1', [userId]);
  return result.rows[0]?.id || null;
}

async function getAttendanceSummaryForPayroll(employeeId, month, year, db = pool) {
  const result = await db.query(
    `WITH period AS (
       SELECT make_date($3, $2, 1) AS start_date,
              (make_date($3, $2, 1) + INTERVAL '1 month - 1 day')::date AS end_date
     ), attendance_summary AS (
       SELECT
         COUNT(*) FILTER (WHERE a.status = 'Present')::NUMERIC AS present_days,
         COUNT(*) FILTER (WHERE a.status = 'Absent')::NUMERIC AS absent_days,
         COUNT(*) FILTER (WHERE a.status = 'Leave')::NUMERIC AS attendance_leave_days
       FROM attendance a, period p
       WHERE a.employee_id = $1 AND a.date BETWEEN p.start_date AND p.end_date
     ), approved_leave AS (
       SELECT COALESCE(SUM(
         LEAST(lr.end_date, p.end_date) - GREATEST(lr.start_date, p.start_date) + 1
       ), 0)::NUMERIC AS approved_leave_days
       FROM leave_requests lr, period p
       WHERE lr.employee_id = $1
         AND lr.status = 'HR Approved'
         AND lr.start_date <= p.end_date
         AND lr.end_date >= p.start_date
     )
     SELECT present_days,
            absent_days,
            (attendance_leave_days + approved_leave_days) AS leave_days
     FROM attendance_summary, approved_leave`,
    [employeeId, month, year]
  );
  return result.rows[0];
}

async function createPayslip(data, db = pool) {
  const result = await db.query(
    `INSERT INTO payslips
       (payroll_run_id, employee_id, basic_salary, hra, other_allowances,
        gross_salary, pf_deduction, esi_deduction, professional_tax, tds,
        loss_of_pay_days, loss_of_pay_amount, total_deductions, net_salary)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     RETURNING *`,
    [
      data.payrollRunId,
      data.employeeId,
      data.basicSalary,
      data.hra,
      data.otherAllowances,
      data.grossSalary,
      data.pfDeduction,
      data.esiDeduction,
      data.professionalTax,
      data.tds,
      data.lossOfPayDays,
      data.lossOfPayAmount,
      data.totalDeductions,
      data.netSalary,
    ]
  );
  return result.rows[0];
}

async function getPayslipsByRun(payrollRunId, db = pool) {
  const result = await db.query(
    `SELECT p.*, e.employee_code, e.full_name
     FROM payslips p
     JOIN employees e ON e.id = p.employee_id
     WHERE p.payroll_run_id = $1
     ORDER BY e.full_name`,
    [payrollRunId]
  );
  return result.rows;
}

async function getPayslipByEmployeeAndRun(employeeId, payrollRunId, db = pool) {
  const result = await db.query(
    `SELECT p.*, e.employee_code, e.full_name, pr.month, pr.year, pr.status AS payroll_status
     FROM payslips p
     JOIN employees e ON e.id = p.employee_id
     JOIN payroll_runs pr ON pr.id = p.payroll_run_id
     WHERE p.employee_id = $1 AND p.payroll_run_id = $2`,
    [employeeId, payrollRunId]
  );
  return result.rows[0] || null;
}

async function getPayslipsByEmployee(employeeId, db = pool) {
  const result = await db.query(
    `SELECT p.*, pr.month, pr.year, pr.status AS payroll_status
     FROM payslips p
     JOIN payroll_runs pr ON pr.id = p.payroll_run_id
     WHERE p.employee_id = $1
     ORDER BY pr.year DESC, pr.month DESC`,
    [employeeId]
  );
  return result.rows;
}

async function markPayrollRunProcessed(id, db = pool) {
  const result = await db.query(
    `UPDATE payroll_runs
     SET status = 'Processed', processed_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return result.rows[0];
}

module.exports = {
  createSalaryStructure,
  getSalaryStructureByEmployee,
  updateSalaryStructure,
  createPayrollRun,
  getPayrollRunByMonthYear,
  getPayrollRuns,
  getActiveEmployees,
  getEmployeeIdByUserId,
  getAttendanceSummaryForPayroll,
  createPayslip,
  getPayslipsByRun,
  getPayslipByEmployeeAndRun,
  getPayslipsByEmployee,
  markPayrollRunProcessed,
};