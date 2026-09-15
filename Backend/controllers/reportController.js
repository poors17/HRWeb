const reports = require('../db/queries/reports');
const { exportToExcel, exportToPdf } = require('../utils/exportHelpers');

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  return res.status(500).json({ message });
}

function formatForRequest(req) {
  const format = String(req.query.format || 'json').toLowerCase();
  return ['json', 'excel', 'pdf'].includes(format) ? format : null;
}

async function respondWithReport(req, res, data, title, columns, sheetName, fileBaseName) {
  const format = formatForRequest(req);
  if (!format) return res.status(400).json({ message: 'format must be excel or pdf' });
  if (format === 'excel') return exportToExcel(res, columns, data, sheetName, `${fileBaseName}.xlsx`);
  if (format === 'pdf') return exportToPdf(res, title, columns, data, `${fileBaseName}.pdf`);
  return res.json(data);
}

const employeeColumns = [
  { header: 'Employee Code', key: 'employee_code', width: 16 },
  { header: 'Full Name', key: 'full_name', width: 24 },
  { header: 'Email', key: 'personal_email', width: 28 },
  { header: 'Department', key: 'department_name', width: 20 },
  { header: 'Designation', key: 'designation_name', width: 20 },
  { header: 'Status', key: 'employment_status', width: 16 },
  { header: 'Joining Date', key: 'date_of_joining', width: 16 },
];

async function getEmployeeReport(req, res) {
  try {
    return await respondWithReport(req, res, await reports.getEmployeeReportData(), 'Employee Report', employeeColumns, 'Employees', 'employee-report');
  } catch (error) {
    return handleError(res, error, 'Unable to generate employee report');
  }
}

async function getAttendanceReport(req, res) {
  const month = Number(req.query.month);
  const year = Number(req.query.year);
  if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(year) || year < 2000) {
    return res.status(400).json({ message: 'month must be 1-12 and year must be a valid four-digit year' });
  }
  try {
    return await respondWithReport(req, res, await reports.getAttendanceReportData(month, year), `Attendance Report - ${month}/${year}`, [
      { header: 'Employee Code', key: 'employee_code', width: 16 },
      { header: 'Full Name', key: 'full_name', width: 24 },
      { header: 'Department', key: 'department_name', width: 20 },
      { header: 'Recorded Days', key: 'recorded_days', width: 16 },
      { header: 'Present', key: 'present_days', width: 12 },
      { header: 'Absent', key: 'absent_days', width: 12 },
      { header: 'Late', key: 'late_days', width: 12 },
      { header: 'Half-Day', key: 'half_day_days', width: 12 },
      { header: 'WFH', key: 'wfh_days', width: 12 },
      { header: 'Working Hours', key: 'working_hours', width: 16 },
    ], 'Attendance', 'attendance-report');
  } catch (error) {
    return handleError(res, error, 'Unable to generate attendance report');
  }
}

async function getLeaveReport(req, res) {
  try {
    return await respondWithReport(req, res, await reports.getLeaveReportData({
      status: req.query.status,
      employeeId: req.query.employeeId ?? req.query.employee_id,
      startDate: req.query.startDate ?? req.query.start_date,
      endDate: req.query.endDate ?? req.query.end_date,
    }), 'Leave Report', [
      { header: 'Employee Code', key: 'employee_code', width: 16 },
      { header: 'Full Name', key: 'full_name', width: 24 },
      { header: 'Leave Type', key: 'leave_type', width: 18 },
      { header: 'Start Date', key: 'start_date', width: 14 },
      { header: 'End Date', key: 'end_date', width: 14 },
      { header: 'Total Days', key: 'total_days', width: 12 },
      { header: 'Status', key: 'status', width: 18 },
      { header: 'Balance Remaining', key: 'balance_remaining_days', width: 18 },
      { header: 'Reason', key: 'reason', width: 30 },
    ], 'Leave', 'leave-report');
  } catch (error) {
    return handleError(res, error, 'Unable to generate leave report');
  }
}

async function getPayrollReport(req, res) {
  const payrollRunId = Number(req.query.payrollRunId ?? req.query.payroll_run_id);
  if (!Number.isInteger(payrollRunId) || payrollRunId <= 0) return res.status(400).json({ message: 'payrollRunId is required' });
  try {
    return await respondWithReport(req, res, await reports.getPayrollReportData(payrollRunId), 'Payroll Report', [
      { header: 'Employee Code', key: 'employee_code', width: 16 },
      { header: 'Full Name', key: 'full_name', width: 24 },
      { header: 'Department', key: 'department_name', width: 20 },
      { header: 'Basic Salary', key: 'basic_salary', width: 14 },
      { header: 'HRA', key: 'hra', width: 12 },
      { header: 'Allowances', key: 'other_allowances', width: 14 },
      { header: 'Gross Salary', key: 'gross_salary', width: 14 },
      { header: 'Total Deductions', key: 'total_deductions', width: 18 },
      { header: 'Net Salary', key: 'net_salary', width: 14 },
    ], 'Payroll', 'payroll-report');
  } catch (error) {
    return handleError(res, error, 'Unable to generate payroll report');
  }
}

async function getDocumentExpiryReport(req, res) {
  const daysAhead = Number(req.query.daysAhead ?? req.query.days_ahead ?? 30);
  if (!Number.isInteger(daysAhead)) return res.status(400).json({ message: 'daysAhead must be an integer' });
  try {
    return await respondWithReport(req, res, await reports.getDocumentExpiryReportData(daysAhead), 'Document Expiry Report', [
      { header: 'Employee Code', key: 'employee_code', width: 16 },
      { header: 'Full Name', key: 'full_name', width: 24 },
      { header: 'Category', key: 'category_name', width: 22 },
      { header: 'File Name', key: 'file_name', width: 24 },
      { header: 'Issue Date', key: 'issue_date', width: 14 },
      { header: 'Expiry Date', key: 'expiry_date', width: 14 },
      { header: 'Expiry Status', key: 'expiry_status', width: 16 },
      { header: 'Verification', key: 'verification_status', width: 16 },
    ], 'Document Expiry', 'document-expiry-report');
  } catch (error) {
    return handleError(res, error, 'Unable to generate document expiry report');
  }
}

async function getRecruitmentReport(req, res) {
  try {
    return await respondWithReport(req, res, await reports.getRecruitmentReportData(), 'Recruitment Report', [
      { header: 'Job Title', key: 'job_title', width: 28 },
      { header: 'Job Status', key: 'job_status', width: 16 },
      { header: 'Candidate Stage', key: 'candidate_stage', width: 24 },
      { header: 'Candidate Count', key: 'candidate_count', width: 16 },
    ], 'Recruitment', 'recruitment-report');
  } catch (error) {
    return handleError(res, error, 'Unable to generate recruitment report');
  }
}

async function getAssetReport(req, res) {
  try {
    return await respondWithReport(req, res, await reports.getAssetReportData(), 'Asset Report', [
      { header: 'Asset Status', key: 'status', width: 18 },
      { header: 'Asset Count', key: 'asset_count', width: 16 },
      { header: 'Returned Assignments', key: 'returned_count', width: 20 },
    ], 'Assets', 'asset-report');
  } catch (error) {
    return handleError(res, error, 'Unable to generate asset report');
  }
}

async function getPerformanceReport(req, res) {
  const cycleId = Number(req.query.cycleId ?? req.query.cycle_id);
  if (!Number.isInteger(cycleId) || cycleId <= 0) return res.status(400).json({ message: 'cycleId is required' });
  try {
    return await respondWithReport(req, res, await reports.getPerformanceReportData(cycleId), 'Performance Report', [
      { header: 'Cycle', key: 'cycle_name', width: 24 },
      { header: 'Employee Code', key: 'employee_code', width: 16 },
      { header: 'Full Name', key: 'full_name', width: 24 },
      { header: 'Goal', key: 'goal_title', width: 28 },
      { header: 'Target', key: 'target', width: 28 },
      { header: 'Weightage', key: 'weightage', width: 14 },
      { header: 'Rating', key: 'rating', width: 12 },
      { header: 'Outcome', key: 'final_outcome', width: 24 },
      { header: 'Review Status', key: 'review_status', width: 18 },
    ], 'Performance', 'performance-report');
  } catch (error) {
    return handleError(res, error, 'Unable to generate performance report');
  }
}

module.exports = {
  getEmployeeReport,
  getAttendanceReport,
  getLeaveReport,
  getPayrollReport,
  getDocumentExpiryReport,
  getRecruitmentReport,
  getAssetReport,
  getPerformanceReport,
};