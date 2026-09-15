const pool = require('../../config/db');

async function getEmployeeIdByUserId(userId) {
  const result = await pool.query('SELECT id FROM employees WHERE user_id = $1', [userId]);
  return result.rows[0]?.id || null;
}

async function createCycle({ name, startDate, endDate, status }) {
  const result = await pool.query(
    `INSERT INTO performance_cycles (name, start_date, end_date, status)
     VALUES ($1, $2, $3, COALESCE($4, 'Active'))
     RETURNING *`,
    [name, startDate, endDate, status || null]
  );
  return result.rows[0];
}

async function getCycles() {
  const result = await pool.query('SELECT * FROM performance_cycles ORDER BY start_date DESC');
  return result.rows;
}

async function createGoal({ cycleId, employeeId, title, description, target, weightage }) {
  const result = await pool.query(
    `INSERT INTO performance_goals
       (cycle_id, employee_id, title, description, target, weightage)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [cycleId, employeeId, title, description || null, target || null, weightage ?? null]
  );
  return result.rows[0];
}

async function getGoalsByEmployee(employeeId) {
  const result = await pool.query(
    `SELECT pg.*, pc.name AS cycle_name, pc.start_date, pc.end_date
     FROM performance_goals pg
     LEFT JOIN performance_cycles pc ON pc.id = pg.cycle_id
     WHERE pg.employee_id = $1
     ORDER BY pc.start_date DESC, pg.id DESC`,
    [employeeId]
  );
  return result.rows;
}

async function createReview({ cycleId, employeeId, selfReview, status, reviewedBy }) {
  const result = await pool.query(
    `INSERT INTO performance_reviews
       (cycle_id, employee_id, self_review, status, reviewed_by)
     VALUES ($1, $2, $3, COALESCE($4, 'Self-Reviewed'), $5)
     RETURNING *`,
    [cycleId, employeeId, selfReview || null, status || null, reviewedBy || null]
  );
  return result.rows[0];
}

async function updateReview(id, data) {
  const allowedFields = ['self_review', 'manager_review', 'rating', 'final_outcome', 'reviewed_by', 'status'];
  const fields = allowedFields.filter((field) => data[field] !== undefined);
  if (!fields.length) return getReviewById(id);
  const values = fields.map((field) => data[field]);
  values.push(id);
  const setClause = fields.map((field, index) => `${field} = $${index + 1}`).concat('updated_at = NOW()').join(', ');
  const result = await pool.query(
    `UPDATE performance_reviews SET ${setClause}
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

async function getReviewById(id) {
  const result = await pool.query('SELECT * FROM performance_reviews WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function getReviewByCycleAndEmployee(cycleId, employeeId) {
  const result = await pool.query(
    'SELECT * FROM performance_reviews WHERE cycle_id = $1 AND employee_id = $2',
    [cycleId, employeeId]
  );
  return result.rows[0] || null;
}

async function getReviewsByCycle(cycleId) {
  const result = await pool.query(
    `SELECT pr.*, e.employee_code, e.full_name, pc.name AS cycle_name
     FROM performance_reviews pr
     JOIN employees e ON e.id = pr.employee_id
     LEFT JOIN performance_cycles pc ON pc.id = pr.cycle_id
     WHERE pr.cycle_id = $1
     ORDER BY e.full_name`,
    [cycleId]
  );
  return result.rows;
}

async function getReviewsByEmployee(employeeId) {
  const result = await pool.query(
    `SELECT pr.*, pc.name AS cycle_name, pc.start_date, pc.end_date
     FROM performance_reviews pr
     LEFT JOIN performance_cycles pc ON pc.id = pr.cycle_id
     WHERE pr.employee_id = $1
     ORDER BY pc.start_date DESC, pr.id DESC`,
    [employeeId]
  );
  return result.rows;
}

module.exports = {
  getEmployeeIdByUserId,
  createCycle,
  getCycles,
  createGoal,
  getGoalsByEmployee,
  createReview,
  updateReview,
  getReviewById,
  getReviewByCycleAndEmployee,
  getReviewsByCycle,
  getReviewsByEmployee,
};