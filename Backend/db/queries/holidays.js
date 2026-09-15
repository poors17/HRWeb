const pool = require('../../config/db');

async function createHoliday({ name, date }) {
  const result = await pool.query(
    'INSERT INTO holidays (name, date) VALUES ($1, $2) RETURNING *',
    [name, date]
  );
  return result.rows[0];
}

async function getAllHolidays() {
  const result = await pool.query('SELECT * FROM holidays ORDER BY date');
  return result.rows;
}

module.exports = { createHoliday, getAllHolidays };