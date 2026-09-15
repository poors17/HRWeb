const pool = require('../../config/db');

async function createDesignation({ name, department_id: departmentId }) {
  const result = await pool.query(
    'INSERT INTO designations (name, department_id) VALUES ($1, $2) RETURNING *',
    [name, departmentId || null]
  );
  return result.rows[0];
}

async function getAllDesignations() {
  const result = await pool.query(
    `SELECT dg.*, d.name AS department_name
     FROM designations dg
     LEFT JOIN departments d ON d.id = dg.department_id
     ORDER BY dg.name`
  );
  return result.rows;
}

module.exports = { createDesignation, getAllDesignations };