const pool = require('../../config/db');

async function createCertification({ employeeId, name, issuedDate, expiryDate, certificateUrl }) {
  const result = await pool.query(
    `INSERT INTO certifications
       (employee_id, name, issued_date, expiry_date, certificate_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [employeeId, name, issuedDate || null, expiryDate || null, certificateUrl || null]
  );
  return result.rows[0];
}

async function getCertificationsByEmployee(employeeId) {
  const result = await pool.query(
    'SELECT * FROM certifications WHERE employee_id = $1 ORDER BY expiry_date NULLS LAST, id DESC',
    [employeeId]
  );
  return result.rows;
}

async function getExpiringCertifications(daysAhead) {
  const result = await pool.query(
    `SELECT c.*, e.employee_code, e.full_name
     FROM certifications c
     JOIN employees e ON e.id = c.employee_id
     WHERE c.expiry_date IS NOT NULL
       AND c.expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + ($1 * INTERVAL '1 day')
     ORDER BY c.expiry_date, e.full_name`,
    [daysAhead]
  );
  return result.rows;
}

module.exports = {
  createCertification,
  getCertificationsByEmployee,
  getExpiringCertifications,
};