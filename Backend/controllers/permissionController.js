const permission = require('../db/queries/permission');

const timePattern = /^\d{2}:\d{2}(:\d{2})?$/;

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23503') return res.status(400).json({ message: 'A referenced record does not exist' });
  return res.status(500).json({ message });
}

async function employeeIdForRequest(req, res) {
  const employeeId = await permission.getEmployeeIdByUserId(req.user.id);
  if (!employeeId) {
    res.status(404).json({ message: 'No employee record is linked to this user' });
    return null;
  }
  return employeeId;
}

async function applyPermission(req, res) {
  const date = req.body.date;
  const fromTime = req.body.from_time ?? req.body.fromTime;
  const toTime = req.body.to_time ?? req.body.toTime;
  if (!date || !timePattern.test(fromTime || '') || !timePattern.test(toTime || '') || fromTime >= toTime) {
    return res.status(400).json({ message: 'date, valid from_time, and to_time are required with from_time before to_time' });
  }
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    return res.status(201).json(await permission.createPermissionRequest({
      employeeId,
      date,
      fromTime,
      toTime,
      reason: req.body.reason,
    }));
  } catch (error) {
    return handleError(res, error, 'Unable to apply for permission');
  }
}

async function getMyPermissionRequests(req, res) {
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    return res.json(await permission.getPermissionRequestsByEmployee(employeeId));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch permission requests');
  }
}

async function getPendingPermission(req, res) {
  try {
    return res.json(await permission.getPendingPermissionRequests());
  } catch (error) {
    return handleError(res, error, 'Unable to fetch pending permission requests');
  }
}

async function approvePermission(req, res) {
  try {
    const request = await permission.updatePermissionStatus(req.params.id, 'Approved', req.user.id);
    if (!request) return res.status(404).json({ message: 'Permission request not found' });
    return res.json(request);
  } catch (error) {
    return handleError(res, error, 'Unable to approve permission request');
  }
}

async function rejectPermission(req, res) {
  try {
    const request = await permission.updatePermissionStatus(req.params.id, 'Rejected', req.user.id);
    if (!request) return res.status(404).json({ message: 'Permission request not found' });
    return res.json(request);
  } catch (error) {
    return handleError(res, error, 'Unable to reject permission request');
  }
}

module.exports = {
  applyPermission,
  getMyPermissionRequests,
  getPendingPermission,
  approvePermission,
  rejectPermission,
};