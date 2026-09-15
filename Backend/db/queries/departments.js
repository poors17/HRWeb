const pool = require('../../config/db');

async function createDepartment({ name }) {
  const result = await pool.query(
    'INSERT INTO departments (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
}

async function getAllDepartments() {
  const result = await pool.query('SELECT * FROM departments ORDER BY name');
  return result.rows;
}

module.exports = { createDepartment, getAllDepartments };