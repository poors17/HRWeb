const pool = require('../../config/db');

async function createBranch({ name, location }) {
  const result = await pool.query(
    'INSERT INTO branches (name, location) VALUES ($1, $2) RETURNING *',
    [name, location || null]
  );
  return result.rows[0];
}

async function getAllBranches() {
  const result = await pool.query('SELECT * FROM branches ORDER BY name');
  return result.rows;
}

module.exports = { createBranch, getAllBranches };