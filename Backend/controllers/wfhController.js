const wfh = require('../db/queries/wfh');
const attendance = require('../db/queries/attendance');
const notifyUser = require('../middleware/notify');

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23503') return res.status(400).json({ message: 'A referenced record does not exist' });
  return res.status(500).json({ message });
}

async function employeeIdForRequest(req, res) {
  const employeeId = await wfh.getEmployeeIdByUserId(req.user.id);
  if (!employeeId) {
    res.status(404).json({ message: 'No employee record is linked to this user' });
    return null;
  }
  return employeeId;
}

function validDateRange(startDate, endDate) {
  return Boolean(startDate && endDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate)
    && /^\d{4}-\d{2}-\d{2}$/.test(endDate) && startDate <= endDate);
}

function datesBetween(startDate, endDate) {
  const dates = [];
  const current = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);
  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}

async function applyWfh(req, res) {
  const startDate = req.body.start_date ?? req.body.startDate;
  const endDate = req.body.end_date ?? req.body.endDate;
  if (!validDateRange(startDate, endDate)) {
    return res.status(400).json({ message: 'valid start_date and end_date are required' });
  }
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    return res.status(201).json(await wfh.createWfhRequest({ employeeId, startDate, endDate, reason: req.body.reason }));
  } catch (error) {
    return handleError(res, error, 'Unable to apply for WFH');
  }
}

async function getMyWfhRequests(req, res) {
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    return res.json(await wfh.getWfhRequestsByEmployee(employeeId));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch WFH requests');
  }
}

async function getPendingWfh(req, res) {
  try {
    return res.json(await wfh.getPendingWfhRequests());
  } catch (error) {
    return handleError(res, error, 'Unable to fetch pending WFH requests');
  }
}

function approvalStageForUser(request, user, requestedStage) {
  if (requestedStage && !['level1', 'level2', 'hr'].includes(requestedStage)) return null;
  if (requestedStage) return requestedStage;
  if (user.role === 'HR' || user.role === 'Super Admin') return 'hr';
  if (user.role !== 'Manager') return null;
  if (request.level1_manager_user_id === user.id) return requestedStage || 'level1';
  if (request.level2_manager_user_id === user.id) return requestedStage || 'level2';
  return null;
}

function canApproveStage(request, user, stage) {
  if (user.role === 'HR' || user.role === 'Super Admin') return stage === 'hr' || Boolean(user.role === 'Super Admin');
  if (user.role !== 'Manager') return false;
  return (stage === 'level1' && request.level1_manager_user_id === user.id)
    || (stage === 'level2' && request.level2_manager_user_id === user.id);
}

async function updateWfhApproval(req, res, status) {
  try {
    const request = await wfh.getWfhRequestById(req.params.id);
    if (!request) return res.status(404).json({ message: 'WFH request not found' });
    const stage = approvalStageForUser(request, req.user, req.body.stage);
    if (!stage || !canApproveStage(request, req.user, stage)) {
      return res.status(403).json({ message: 'You are not authorized to approve this WFH approval stage' });
    }
    if (request[`${stage}_status`] === status) return res.json(request);

    const updatedRequest = await wfh.updateWfhStage(req.params.id, stage, status, req.user.id);
    if (status === 'Approved' && updatedRequest.status === 'Approved') {
      for (const date of datesBetween(request.start_date, request.end_date)) {
        await attendance.markWfh(request.employee_id, date);
      }
    }
    notifyUser(request.user_id, `WFH request ${status.toLowerCase()}`, `Your WFH request was ${status.toLowerCase()}.`, 'WFH', updatedRequest.id);
    return res.json(updatedRequest);
  } catch (error) {
    return handleError(res, error, 'Unable to update WFH approval');
  }
}

module.exports = {
  applyWfh,
  getMyWfhRequests,
  getPendingWfh,
  approveWfh: (req, res) => updateWfhApproval(req, res, 'Approved'),
  rejectWfh: (req, res) => updateWfhApproval(req, res, 'Rejected'),
};