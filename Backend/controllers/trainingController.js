const training = require('../db/queries/training');
const performance = require('../db/queries/performance');

const enrollmentStatuses = ['Enrolled', 'Completed', 'Dropped'];

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23503') return res.status(400).json({ message: 'A referenced record does not exist' });
  return res.status(500).json({ message });
}

async function employeeIdForRequest(req, res) {
  const employeeId = await performance.getEmployeeIdByUserId(req.user.id);
  if (!employeeId) {
    res.status(404).json({ message: 'No employee record is linked to this user' });
    return null;
  }
  return employeeId;
}

async function createProgram(req, res) {
  const {
    title,
    trainer_name: trainerName,
    start_date: startDate,
    end_date: endDate,
    materials_url: materialsUrl,
  } = req.body;
  if (!title) return res.status(400).json({ message: 'title is required' });
  try {
    return res.status(201).json(await training.createProgram({ title: title.trim(), trainerName, startDate, endDate, materialsUrl }));
  } catch (error) {
    return handleError(res, error, 'Unable to create training program');
  }
}

async function getPrograms(req, res) {
  try {
    return res.json(await training.getPrograms());
  } catch (error) {
    return handleError(res, error, 'Unable to fetch training programs');
  }
}

async function enroll(req, res) {
  const trainingProgramId = req.body.training_program_id ?? req.body.trainingProgramId;
  if (!trainingProgramId) return res.status(400).json({ message: 'training_program_id is required' });
  try {
    const employeeId = req.body.employee_id ?? req.body.employeeId ?? await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    return res.status(201).json(await training.enrollTrainee({ trainingProgramId, employeeId }));
  } catch (error) {
    return handleError(res, error, 'Unable to enroll employee');
  }
}

async function updateEnrollmentStatus(req, res) {
  const { status, completion_date: completionDate } = req.body;
  if (!enrollmentStatuses.includes(status)) return res.status(400).json({ message: 'status must be Enrolled, Completed, or Dropped' });
  try {
    const enrollment = await training.updateEnrollmentStatus(req.params.id, status, completionDate);
    if (!enrollment) return res.status(404).json({ message: 'Training enrollment not found' });
    return res.json(enrollment);
  } catch (error) {
    return handleError(res, error, 'Unable to update enrollment status');
  }
}

async function getMyEnrollments(req, res) {
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    return res.json(await training.getEnrollmentsByEmployee(employeeId));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch training enrollments');
  }
}

module.exports = { createProgram, getPrograms, enroll, updateEnrollmentStatus, getMyEnrollments };