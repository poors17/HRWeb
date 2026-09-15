const pool = require('../config/db');
const payroll = require('../db/queries/payroll');
const logAction = require('../middleware/auditLogger');
const notifyUser = require('../middleware/notify');

const privilegedRoles = ['Super Admin', 'Finance/Payroll'];

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23505') return res.status(409).json({ message: 'A payroll record already exists for that period or employee' });
  if (error.code === '23503') return res.status(400).json({ message: 'A referenced record does not exist' });
  return res.status(500).json({ message });
}

function salaryData(body) {
  return {
    basicSalary: body.basic_salary ?? body.basicSalary,
    hra: body.hra,
    otherAllowances: body.other_allowances ?? body.otherAllowances,
    pfDeduction: body.pf_deduction ?? body.pfDeduction,
    esiDeduction: body.esi_deduction ?? body.esiDeduction,
    professionalTax: body.professional_tax ?? body.professionalTax,
    tds: body.tds,
    effectiveFrom: body.effective_from ?? body.effectiveFrom,
  };
}

function salaryUpdateData(body) {
  const data = salaryData(body);
  return {
    basic_salary: data.basicSalary,
    hra: data.hra,
    other_allowances: data.otherAllowances,
    pf_deduction: data.pfDeduction,
    esi_deduction: data.esiDeduction,
    professional_tax: data.professionalTax,
    tds: data.tds,
    effective_from: data.effectiveFrom,
  };
}

function validPositiveNumber(value) {
  return Number.isFinite(Number(value)) && Number(value) >= 0;
}

async function setSalaryStructure(req, res) {
  const employeeId = Number(req.body.employee_id ?? req.body.employeeId);
  const data = salaryData(req.body);
  if (!employeeId || !validPositiveNumber(data.basicSalary) || !data.effectiveFrom) {
    return res.status(400).json({ message: 'employee_id, non-negative basic_salary, and effective_from are required' });
  }

  try {
    const existing = await payroll.getSalaryStructureByEmployee(employeeId);
    const structure = existing
      ? await payroll.updateSalaryStructure(employeeId, salaryUpdateData(req.body))
      : await payroll.createSalaryStructure({ employeeId, ...data });
    return res.status(existing ? 200 : 201).json(structure);
  } catch (error) {
    return handleError(res, error, 'Unable to save salary structure');
  }
}

async function getSalaryStructure(req, res) {
  try {
    const structure = await payroll.getSalaryStructureByEmployee(req.params.employeeId);
    if (!structure) return res.status(404).json({ message: 'Salary structure not found' });
    return res.json(structure);
  } catch (error) {
    return handleError(res, error, 'Unable to fetch salary structure');
  }
}

async function runPayroll(req, res) {
  const month = Number(req.body.month);
  const year = Number(req.body.year);
  if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(year) || year < 2000) {
    return res.status(400).json({ message: 'month must be 1-12 and year must be a valid four-digit year' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (await payroll.getPayrollRunByMonthYear(month, year, client)) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'Payroll has already been created for that month and year' });
    }

    const employees = await payroll.getActiveEmployees(client);
    const missingStructures = employees.filter((employee) => employee.basic_salary === null);
    if (missingStructures.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        message: 'Every active employee must have a salary structure before payroll can run',
        employeeIds: missingStructures.map((employee) => employee.id),
      });
    }

    const run = await payroll.createPayrollRun(month, year, req.user.id, client);
    const daysInMonth = new Date(year, month, 0).getDate();
    const payslips = [];
    const pendingNotifications = [];

    for (const employee of employees) {
      const summary = await payroll.getAttendanceSummaryForPayroll(employee.id, month, year, client);
      const lossOfPayDays = Math.max(0, Number(summary.absent_days || 0));
      const basicSalary = Number(employee.basic_salary);
      const hra = Number(employee.hra || 0);
      const otherAllowances = Number(employee.other_allowances || 0);
      const grossSalary = basicSalary + hra + otherAllowances;
      const lossOfPayAmount = (grossSalary / daysInMonth) * lossOfPayDays;
      const pfDeduction = Number(employee.pf_deduction || 0);
      const esiDeduction = Number(employee.esi_deduction || 0);
      const professionalTax = Number(employee.professional_tax || 0);
      const tds = Number(employee.tds || 0);
      const totalDeductions = pfDeduction + esiDeduction + professionalTax + tds + lossOfPayAmount;
      const netSalary = grossSalary - totalDeductions;

      const payslip = await payroll.createPayslip({
        payrollRunId: run.id,
        employeeId: employee.id,
        basicSalary,
        hra,
        otherAllowances,
        grossSalary: grossSalary.toFixed(2),
        pfDeduction,
        esiDeduction,
        professionalTax,
        tds,
        lossOfPayDays,
        lossOfPayAmount: lossOfPayAmount.toFixed(2),
        totalDeductions: totalDeductions.toFixed(2),
        netSalary: netSalary.toFixed(2),
      }, client);
      payslips.push(payslip);
      pendingNotifications.push({ userId: employee.user_id, payslipId: payslip.id });
    }

    const processedRun = await payroll.markPayrollRunProcessed(run.id, client);
    await client.query('COMMIT');
    logAction(req, 'CREATE', 'Payroll', processedRun.id, `Processed payroll for ${month}/${year}`);
    for (const notification of pendingNotifications) {
      notifyUser(notification.userId, 'Payslip generated', `Your payslip for ${month}/${year} is now available.`, 'Payroll', notification.payslipId);
    }
    return res.status(201).json({ payrollRun: processedRun, payslips });
  } catch (error) {
    await client.query('ROLLBACK');
    return handleError(res, error, 'Unable to run payroll');
  } finally {
    client.release();
  }
}

async function getPayrollRuns(req, res) {
  try {
    return res.json(await payroll.getPayrollRuns());
  } catch (error) {
    return handleError(res, error, 'Unable to fetch payroll runs');
  }
}

async function canViewEmployeePayslip(req, employeeId) {
  if (privilegedRoles.includes(req.user.role)) return true;
  const ownEmployeeId = await payroll.getEmployeeIdByUserId(req.user.id);
  return ownEmployeeId === Number(employeeId);
}

async function getPayslip(req, res) {
  try {
    if (!(await canViewEmployeePayslip(req, req.params.employeeId))) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    const payslip = await payroll.getPayslipByEmployeeAndRun(req.params.employeeId, req.params.payrollRunId);
    if (!payslip) return res.status(404).json({ message: 'Payslip not found' });
    return res.json(payslip);
  } catch (error) {
    return handleError(res, error, 'Unable to fetch payslip');
  }
}

async function getMyPayslips(req, res) {
  try {
    const employeeId = await payroll.getEmployeeIdByUserId(req.user.id);
    if (!employeeId) return res.status(404).json({ message: 'No employee record is linked to this user' });
    return res.json(await payroll.getPayslipsByEmployee(employeeId));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch payslip history');
  }
}

module.exports = {
  setSalaryStructure,
  getSalaryStructure,
  runPayroll,
  getPayrollRuns,
  getPayslip,
  getMyPayslips,
};