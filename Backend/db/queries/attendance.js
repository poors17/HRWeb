const pool = require('../../config/db');

async function getEmployeeIdByUserId(userId) {
  const result = await pool.query('SELECT id FROM employees WHERE user_id = $1', [userId]);
  return result.rows[0]?.id || null;
}

async function getTodayAttendanceByEmployee(employeeId) {
  const result = await pool.query(
    `SELECT punch_in, punch_out, status, working_hours
     FROM attendance
     WHERE employee_id = $1 AND date = CURRENT_DATE`,
    [employeeId]
  );

  return result.rows[0] || null;
}

async function markPunchIn(employeeId, date, time) {
  const result = await pool.query(
    `INSERT INTO attendance (employee_id, date, punch_in, status)
     VALUES ($1, $2, $3, 'Present')
     ON CONFLICT (employee_id, date)
     DO UPDATE SET punch_in = EXCLUDED.punch_in, status = 'Present'
     RETURNING *`,
    [employeeId, date, time]
  );
  return result.rows[0];
}

async function markPunchOut(employeeId, date, time) {
  const result = await pool.query(
    `UPDATE attendance
     SET punch_out = $1,
         working_hours = ROUND((EXTRACT(EPOCH FROM ($1::timestamp - punch_in)) / 3600)::numeric, 2)
     WHERE employee_id = $2 AND date = $3
     RETURNING *`,
    [time, employeeId, date]
  );
  return result.rows[0] || null;
}

async function markWfh(employeeId, date) {
  const result = await pool.query(
    `INSERT INTO attendance (employee_id, date, status)
     VALUES ($1, $2, 'WFH')
     ON CONFLICT (employee_id, date)
     DO UPDATE SET status = 'WFH'
     RETURNING *`,
    [employeeId, date]
  );
  return result.rows[0];
}

async function getAttendanceByEmployee(employeeId, filters = {}) {
  const values = [employeeId];
  const conditions = ['a.employee_id = $1'];
  if (filters.from) {
    values.push(filters.from);
    conditions.push(`a.date >= $${values.length}`);
  }
  if (filters.to) {
    values.push(filters.to);
    conditions.push(`a.date <= $${values.length}`);
  }

  const result = await pool.query(
    `SELECT a.*, e.employee_code, e.full_name
     FROM attendance a
     LEFT JOIN employees e ON e.id = a.employee_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY a.date DESC`,
    values
  );
  return result.rows;
}

async function getAttendanceByDate(date) {
  const result = await pool.query(
    `SELECT a.*, e.employee_code, e.full_name
     FROM attendance a
     LEFT JOIN employees e ON e.id = a.employee_id
     WHERE a.date = $1
     ORDER BY e.full_name`,
    [date]
  );
  return result.rows;
}

module.exports = {
  getEmployeeIdByUserId,
  getTodayAttendanceByEmployee,
  markPunchIn,
  markPunchOut,
  markWfh,
  getAttendanceByEmployee,
  getAttendanceByDate,
};