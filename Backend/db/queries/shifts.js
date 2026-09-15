const pool = require('../../config/db');

async function createShift({ name, start_time: startTime, end_time: endTime }) {
  const result = await pool.query(
    'INSERT INTO shifts (name, start_time, end_time) VALUES ($1, $2, $3) RETURNING *',
    [name, startTime, endTime]
  );
  return result.rows[0];
}

async function getAllShifts() {
  const result = await pool.query('SELECT * FROM shifts ORDER BY name');
  return result.rows;
}

module.exports = { createShift, getAllShifts };