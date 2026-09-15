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

async function approveWfh(req, res) {
  try {
    const request = await wfh.getWfhRequestById(req.params.id);
    if (!request) return res.status(404).json({ message: 'WFH request not found' });
    if (request.status === 'Rejected') return res.status(409).json({ message: 'Rejected WFH request cannot be approved' });
    if (request.status === 'Approved') return res.json(request);

    const approvedRequest = await wfh.updateWfhStatus(req.params.id, 'Approved', req.user.id);
    for (const date of datesBetween(request.start_date, request.end_date)) {
      await attendance.markWfh(request.employee_id, date);
    }
    notifyUser(request.user_id, 'WFH request approved', 'Your WFH request was approved.', 'WFH', approvedRequest.id);
    return res.json(approvedRequest);
  } catch (error) {
    return handleError(res, error, 'Unable to approve WFH request');
  }
}

async function rejectWfh(req, res) {
  try {
    const existingRequest = await wfh.getWfhRequestById(req.params.id);
    if (!existingRequest) return res.status(404).json({ message: 'WFH request not found' });
    const request = await wfh.updateWfhStatus(req.params.id, 'Rejected', req.user.id);
    notifyUser(existingRequest.user_id, 'WFH request rejected', 'Your WFH request was rejected.', 'WFH', request.id);
    return res.json(request);
  } catch (error) {
    return handleError(res, error, 'Unable to reject WFH request');
  }
}

module.exports = {
  applyWfh,
  getMyWfhRequests,
  getPendingWfh,
  approveWfh,
  rejectWfh,
};