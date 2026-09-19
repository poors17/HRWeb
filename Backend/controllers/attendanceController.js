const attendance = require('../db/queries/attendance');

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23503') return res.status(400).json({ message: 'A referenced record does not exist' });
  if (error.code === '23505') return res.status(409).json({ message: 'Attendance already exists for that date' });
  return res.status(500).json({ message });
}

async function employeeIdForRequest(req, res) {
  const employeeId = await attendance.getEmployeeIdByUserId(req.user.id);
  if (!employeeId) {
    res.status(404).json({ message: 'No employee record is linked to this user' });
    return null;
  }
  return employeeId;
}

async function rejectUnapprovedWfhPunch(employeeId, date, res) {
  const request = await attendance.getWfhRequestForDate(employeeId, date);
  if (request && request.status !== 'Approved') {
    res.status(403).json({ message: 'Punching is not allowed while the WFH request for this date is awaiting approval or rejected' });
    return true;
  }
  return false;
}

async function punchIn(req, res) {
  const { date, time } = req.body;
  if (!date || !time) return res.status(400).json({ message: 'date and time are required' });

  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    if (await rejectUnapprovedWfhPunch(employeeId, date, res)) return null;
    return res.status(201).json(await attendance.markPunchIn(employeeId, date, time));
  } catch (error) {
    return handleError(res, error, 'Unable to record punch-in');
  }
}

async function punchOut(req, res) {
  const { date, time } = req.body;
  if (!date || !time) return res.status(400).json({ message: 'date and time are required' });

  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    if (await rejectUnapprovedWfhPunch(employeeId, date, res)) return null;
    const record = await attendance.markPunchOut(employeeId, date, time);
    if (!record) return res.status(404).json({ message: 'No punch-in found for that date' });
    return res.json(record);
  } catch (error) {
    return handleError(res, error, 'Unable to record punch-out');
  }
}

async function getMyAttendance(req, res) {
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    return res.json(await attendance.getAttendanceByEmployee(employeeId, req.query));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch attendance');
  }
}

async function getAttendanceByDate(req, res) {
  if (!req.params.date) return res.status(400).json({ message: 'date is required' });
  try {
    return res.json(await attendance.getAttendanceByDate(req.params.date));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch attendance by date');
  }
}

module.exports = { punchIn, punchOut, getMyAttendance, getAttendanceByDate };