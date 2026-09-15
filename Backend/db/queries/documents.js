const pool = require('../../config/db');

async function createCategory(name) {
  const result = await pool.query(
    'INSERT INTO document_categories (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
}

async function getAllCategories() {
  const result = await pool.query('SELECT * FROM document_categories ORDER BY name');
  return result.rows;
}

async function uploadDocument(data) {
  const result = await pool.query(
    `INSERT INTO employee_documents
       (employee_id, category_id, file_url, file_name, issue_date, expiry_date, uploaded_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.employeeId,
      data.categoryId,
      data.fileUrl,
      data.fileName || null,
      data.issueDate || null,
      data.expiryDate || null,
      data.uploadedBy,
    ]
  );
  return result.rows[0];
}

async function getDocumentsByEmployee(employeeId) {
  const result = await pool.query(
    `SELECT ed.*, dc.name AS category_name,
            uploader.name AS uploaded_by_name, verifier.name AS verified_by_name
     FROM employee_documents ed
     LEFT JOIN document_categories dc ON dc.id = ed.category_id
     LEFT JOIN users uploader ON uploader.id = ed.uploaded_by
     LEFT JOIN users verifier ON verifier.id = ed.verified_by
     WHERE ed.employee_id = $1
     ORDER BY ed.created_at DESC`,
    [employeeId]
  );
  return result.rows;
}

async function getDocumentById(id) {
  const result = await pool.query(
    `SELECT ed.*, dc.name AS category_name, e.employee_code, e.full_name,
            uploader.name AS uploaded_by_name, verifier.name AS verified_by_name
     FROM employee_documents ed
     LEFT JOIN document_categories dc ON dc.id = ed.category_id
     LEFT JOIN employees e ON e.id = ed.employee_id
     LEFT JOIN users uploader ON uploader.id = ed.uploaded_by
     LEFT JOIN users verifier ON verifier.id = ed.verified_by
     WHERE ed.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function updateVerificationStatus(id, status, verifiedBy) {
  const result = await pool.query(
    `UPDATE employee_documents
     SET verification_status = $1, verified_by = $2
     WHERE id = $3
     RETURNING *`,
    [status, verifiedBy, id]
  );
  return result.rows[0] || null;
}

async function getExpiringDocuments(daysAhead) {
  const result = await pool.query(
    `SELECT ed.*, dc.name AS category_name, e.employee_code, e.full_name
     FROM employee_documents ed
     LEFT JOIN document_categories dc ON dc.id = ed.category_id
     JOIN employees e ON e.id = ed.employee_id
     WHERE ed.expiry_date IS NOT NULL
       AND ed.expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + ($1 * INTERVAL '1 day')
     ORDER BY ed.expiry_date, e.full_name`,
    [daysAhead]
  );
  return result.rows;
}

async function deleteDocument(id) {
  const result = await pool.query(
    'DELETE FROM employee_documents WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0] || null;
}

async function getEmployeeIdByUserId(userId) {
  const result = await pool.query('SELECT id FROM employees WHERE user_id = $1', [userId]);
  return result.rows[0]?.id || null;
}

module.exports = {
  createCategory,
  getAllCategories,
  uploadDocument,
  getDocumentsByEmployee,
  getDocumentById,
  updateVerificationStatus,
  getExpiringDocuments,
  deleteDocument,
  getEmployeeIdByUserId,
};