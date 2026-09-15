const leave = require('../db/queries/leave');
const logAction = require('../middleware/auditLogger');
const notifyUser = require('../middleware/notify');

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
  const { leaveTypeId, startDate, endDate, totalDays, reason } = req.body;
  const days = Number(totalDays);
  if (!leaveTypeId || !startDate || !endDate || !Number.isFinite(days) || days <= 0) {
    return res.status(400).json({ message: 'leaveTypeId, startDate, endDate, and a positive totalDays are required' });
  }
  if (startDate > endDate) return res.status(400).json({ message: 'startDate must be before or equal to endDate' });

  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    const year = Number(String(startDate).slice(0, 4));
    const balances = await leave.getLeaveBalance(employeeId, year);
    const balance = balances.find((item) => Number(item.leave_type_id) === Number(leaveTypeId));
    if (!balance) return res.status(400).json({ message: 'No leave balance found for this leave type and year' });
    if (Number(balance.total_days) - Number(balance.used_days) < days) {
      return res.status(400).json({ message: 'Insufficient leave balance' });
    }

    return res.status(201).json(await leave.createLeaveRequest({
      employeeId,
      leaveTypeId,
      startDate,
      endDate,
      totalDays: days,
      reason,
    }));
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

async function getLeaveBalance(req, res) {
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    const year = Number(req.query.year) || new Date().getFullYear();
    return res.json(await leave.getLeaveBalance(employeeId, year));
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
  getLeaveBalance,
};