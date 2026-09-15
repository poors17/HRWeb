const exit = require('../db/queries/exit');

const clearanceTypes = ['Manager', 'HR', 'Asset', 'IT', 'Finance'];
const clearanceStatuses = {
  Manager: 'Manager Cleared',
  HR: 'HR Cleared',
  Asset: 'Assets Cleared',
  IT: 'IT Cleared',
  Finance: 'Settled',
};
const privilegedRoles = ['HR', 'Super Admin'];

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23503') return res.status(400).json({ message: 'A referenced record does not exist' });
  return res.status(500).json({ message });
}

async function employeeIdForRequest(req, res) {
  const employeeId = await exit.getEmployeeIdByUserId(req.user.id);
  if (!employeeId) {
    res.status(404).json({ message: 'No employee record is linked to this user' });
    return null;
  }
  return employeeId;
}

async function submitExitRequest(req, res) {
  const {
    resignation_date: resignationDate,
    last_working_date: lastWorkingDate,
    notice_period_days: noticePeriodDays,
    reason,
  } = req.body;
  if (!resignationDate) return res.status(400).json({ message: 'resignation_date is required' });
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    return res.status(201).json(await exit.createExitRequest({ employeeId, resignationDate, lastWorkingDate, noticePeriodDays, reason }));
  } catch (error) {
    return handleError(res, error, 'Unable to submit exit request');
  }
}

async function getExitRequest(req, res) {
  try {
    const request = await exit.getExitRequestById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Exit request not found' });
    if (!privilegedRoles.includes(req.user.role)) {
      const employeeId = await employeeIdForRequest(req, res);
      if (!employeeId) return null;
      if (Number(request.employee_id) !== Number(employeeId)) return res.status(403).json({ message: 'Insufficient permissions' });
    }
    const clearances = await exit.getClearancesByExitRequest(req.params.id);
    return res.json({ ...request, clearances });
  } catch (error) {
    return handleError(res, error, 'Unable to fetch exit request');
  }
}

async function updateClearanceStatus(req, res) {
  const {
    clearance_type: clearanceType,
    is_cleared: isCleared = true,
    remarks,
  } = req.body;
  if (!clearanceTypes.includes(clearanceType) || typeof isCleared !== 'boolean') {
    return res.status(400).json({ message: 'clearance_type and boolean is_cleared are required' });
  }
  try {
    const request = await exit.getExitRequestById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Exit request not found' });
    const clearance = await exit.updateClearance(req.params.id, clearanceType, isCleared, remarks, req.user.id);
    const updatedRequest = isCleared
      ? await exit.updateExitStatus(req.params.id, clearanceStatuses[clearanceType])
      : request;
    return res.json({ request: updatedRequest, clearance });
  } catch (error) {
    return handleError(res, error, 'Unable to update exit clearance');
  }
}

async function completeExit(req, res) {
  try {
    const request = await exit.updateExitStatus(req.params.id, 'Completed', req.body.exit_interview_notes);
    if (!request) return res.status(404).json({ message: 'Exit request not found' });
    return res.json(request);
  } catch (error) {
    return handleError(res, error, 'Unable to complete exit request');
  }
}

async function getMyExitStatus(req, res) {
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    const request = await exit.getMyExitRequest(employeeId);
    if (!request) return res.status(404).json({ message: 'No exit request found' });
    return res.json(request);
  } catch (error) {
    return handleError(res, error, 'Unable to fetch exit status');
  }
}

module.exports = {
  submitExitRequest,
  getExitRequest,
  updateClearanceStatus,
  completeExit,
  getMyExitStatus,
};