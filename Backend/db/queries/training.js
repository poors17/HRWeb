const pool = require('../../config/db');

async function createProgram({ title, trainerName, startDate, endDate, materialsUrl }) {
  const result = await pool.query(
    `INSERT INTO training_programs
       (title, trainer_name, start_date, end_date, materials_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, trainerName || null, startDate || null, endDate || null, materialsUrl || null]
  );
  return result.rows[0];
}

async function getPrograms() {
  const result = await pool.query('SELECT * FROM training_programs ORDER BY start_date NULLS LAST, id DESC');
  return result.rows;
}

async function enrollTrainee({ trainingProgramId, employeeId }) {
  const result = await pool.query(
    `INSERT INTO training_enrollments (training_program_id, employee_id)
     VALUES ($1, $2)
     RETURNING *`,
    [trainingProgramId, employeeId]
  );
  return result.rows[0];
}

async function updateEnrollmentStatus(id, status, completionDate) {
  const result = await pool.query(
    `UPDATE training_enrollments
     SET status = $1, completion_date = $2
     WHERE id = $3
     RETURNING *`,
    [status, completionDate || (status === 'Completed' ? new Date().toISOString().slice(0, 10) : null), id]
  );
  return result.rows[0] || null;
}

async function getEnrollmentsByEmployee(employeeId) {
  const result = await pool.query(
    `SELECT te.*, tp.title, tp.trainer_name, tp.start_date, tp.end_date, tp.materials_url
     FROM training_enrollments te
     JOIN training_programs tp ON tp.id = te.training_program_id
     WHERE te.employee_id = $1
     ORDER BY tp.start_date DESC NULLS LAST, te.id DESC`,
    [employeeId]
  );
  return result.rows;
}

async function getEnrollmentsByProgram(programId) {
  const result = await pool.query(
    `SELECT te.*, e.employee_code, e.full_name
     FROM training_enrollments te
     JOIN employees e ON e.id = te.employee_id
     WHERE te.training_program_id = $1
     ORDER BY e.full_name`,
    [programId]
  );
  return result.rows;
}

module.exports = {
  createProgram,
  getPrograms,
  enrollTrainee,
  updateEnrollmentStatus,
  getEnrollmentsByEmployee,
  getEnrollmentsByProgram,
};