const leave = require('../db/queries/leave');
const employees = require('../db/queries/employees');
const logAction = require('../middleware/auditLogger');
const notifyUser = require('../middleware/notify');

function calculateInclusiveDays(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const difference = end.getTime() - start.getTime();
  const dayCount = Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;
  return dayCount > 0 ? dayCount : 0;
}

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23503') return res.status(400).json({ message: 'A referenced record does not exist' });
  return res.status(500).json({ message });
}

async function employeeIdForRequest(req, res) {
  const employeeId = await leave.getEmployeeIdByUserId(req.user.id);
  if (!employeeId) {
    res.status(404).json({ message: 'No employee record is linked to this user' });
    return null;
  }
  return employeeId;
}

async function applyLeave(req, res) {
  const {
    leaveTypeId,
    startDate,
    endDate,
    totalDays,
    reason,
    handoverEmployeeId,
    contactNumber,
  } = req.body;

  if (!leaveTypeId || !startDate || !endDate) {
    return res.status(400).json({ message: 'leaveTypeId, startDate, and endDate are required' });
  }

  if (startDate > endDate) {
    return res.status(400).json({ message: 'startDate must be before or equal to endDate' });
  }

  const computedDays = calculateInclusiveDays(startDate, endDate);
  if (!Number.isFinite(computedDays) || computedDays <= 0) {
    return res.status(400).json({ message: 'Invalid leave date range' });
  }

  const days = Number(totalDays) || computedDays;
  if (!Number.isFinite(days) || days <= 0) {
    return res.status(400).json({ message: 'A positive totalDays value is required' });
  }

  if (days !== computedDays) {
    return res.status(400).json({ message: 'totalDays does not match the selected date range' });
  }

  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;

    if (handoverEmployeeId) {
      const handoverEmployee = await employees.getEmployeeById(handoverEmployeeId);
      if (!handoverEmployee) {
        return res.status(400).json({ message: 'handoverEmployeeId must refer to an existing active employee' });
      }
      if (Number(handoverEmployee.id) === Number(employeeId)) {
        return res.status(400).json({ message: 'handoverEmployeeId cannot be the same as the current employee' });
      }
    }

    const year = Number(String(startDate).slice(0, 4));
    await leave.ensureLeaveBalancesForEmployee(employeeId, year);
    const balances = await leave.getLeaveBalance(employeeId, year);
    const balance = balances.find((item) => Number(item.leave_type_id) === Number(leaveTypeId));
    if (!balance) {
      return res.status(400).json({ message: 'No leave balance found for this leave type and year' });
    }

    const remaining = Number(balance.total_days) - Number(balance.used_days);
    if (remaining < days) {
      return res.status(400).json({ message: `Insufficient leave balance for ${balance.leave_type_name}. Remaining: ${remaining} day(s).` });
    }

    const overlap = await leave.getLeaveRequestsByEmployee(employeeId);
    const overlappingRequest = overlap.find((request) => {
      if (Number(request.leave_type_id) !== Number(leaveTypeId)) return false;
      if (request.status === 'Rejected') return false;
      const requestStart = new Date(`${request.start_date}T00:00:00`);
      const requestEnd = new Date(`${request.end_date}T00:00:00`);
      const candidateStart = new Date(`${startDate}T00:00:00`);
      const candidateEnd = new Date(`${endDate}T00:00:00`);
      return candidateStart <= requestEnd && candidateEnd >= requestStart;
    });

    if (overlappingRequest) {
      return res.status(400).json({ message: 'This leave request overlaps with an existing leave request for the same leave type.' });
    }

    const createdLeave = await leave.createLeaveRequest({
      employeeId,
      leaveTypeId,
      startDate,
      endDate,
      totalDays: days,
      reason,
      handoverEmployeeId,
      contactNumber,
    });

    return res.status(201).json({
      ...createdLeave,
      leave_type_name: (await leave.getLeaveTypes()).find((type) => Number(type.id) === Number(leaveTypeId))?.leave_type_name || null,
    });
  } catch (error) {
    return handleError(res, error, 'Unable to apply for leave');
  }
}

async function getMyLeaveRequests(req, res) {
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    return res.json(await leave.getLeaveRequestsByEmployee(employeeId));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch leave requests');
  }
}

async function getPendingApprovals(req, res) {
  try {
    return res.json(await leave.getPendingLeaveRequests());
  } catch (error) {
    return handleError(res, error, 'Unable to fetch pending leave requests');
  }
}

async function approveLeave(req, res) {
  const status = req.body.status || 'HR Approved';
  if (!['Manager Approved', 'HR Approved'].includes(status)) {
    return res.status(400).json({ message: 'status must be Manager Approved or HR Approved' });
  }

  try {
    const request = await leave.getLeaveRequestById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Leave request not found' });
    if (request.status === 'Rejected') return res.status(409).json({ message: 'Rejected leave cannot be approved' });
    if (request.status === 'HR Approved') return res.json(request);

    if (status === 'HR Approved') {
      const year = new Date(request.start_date).getFullYear();
      const balance = await leave.deductLeaveBalance(
        request.employee_id,
        request.leave_type_id,
        year,
        request.total_days
      );
      if (!balance) return res.status(400).json({ message: 'Insufficient or missing leave balance' });
    }

    const updatedRequest = await leave.updateLeaveRequestStatus(req.params.id, status, req.user.id);
    logAction(req, 'APPROVE', 'Leave', updatedRequest.id, `Leave request ${status}`);
    notifyUser(request.user_id, 'Leave request approved', `Your leave request was ${status.toLowerCase()}.`, 'Leave', updatedRequest.id);
    return res.json(updatedRequest);
  } catch (error) {
    return handleError(res, error, 'Unable to approve leave request');
  }
}

async function rejectLeave(req, res) {
  try {
    const existingRequest = await leave.getLeaveRequestById(req.params.id);
    if (!existingRequest) return res.status(404).json({ message: 'Leave request not found' });
    const request = await leave.updateLeaveRequestStatus(req.params.id, 'Rejected', req.user.id);
    logAction(req, 'REJECT', 'Leave', request.id, 'Leave request rejected');
    notifyUser(existingRequest.user_id, 'Leave request rejected', 'Your leave request was rejected.', 'Leave', request.id);
    return res.json(request);
  } catch (error) {
    return handleError(res, error, 'Unable to reject leave request');
  }
}

async function getLeaveTypes(req, res) {
  try {
    return res.json(await leave.getLeaveTypes());
  } catch (error) {
    return handleError(res, error, 'Unable to fetch leave types');
  }
}

async function getLeaveBalance(req, res) {
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    const year = Number(req.query.year) || new Date().getFullYear();
    await leave.ensureLeaveBalancesForEmployee(employeeId, year);
    const balances = await leave.getLeaveBalance(employeeId, year);
    return res.json(balances.map((item) => ({
      ...item,
      total_days: Number(item.total_days ?? item.default_days_per_year ?? 0),
      used_days: Number(item.used_days ?? 0),
      remaining: Number(item.total_days ?? item.default_days_per_year ?? 0) - Number(item.used_days ?? 0),
    })));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch leave balance');
  }
}

module.exports = {
  applyLeave,
  getMyLeaveRequests,
  getPendingApprovals,
  approveLeave,
  rejectLeave,
  getLeaveTypes,
  getLeaveBalance,
};