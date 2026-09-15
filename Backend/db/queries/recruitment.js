const pool = require('../../config/db');

async function createJobPosting({ title, departmentId, description, status, postedBy }) {
  const result = await pool.query(
    `INSERT INTO job_postings (title, department_id, description, status, posted_by)
     VALUES ($1, $2, $3, COALESCE($4, 'Open'), $5)
     RETURNING *`,
    [title, departmentId || null, description || null, status || null, postedBy]
  );
  return result.rows[0];
}

async function getJobPostings() {
  const result = await pool.query(
    `SELECT jp.*, d.name AS department_name, u.name AS posted_by_name
     FROM job_postings jp
     LEFT JOIN departments d ON d.id = jp.department_id
     LEFT JOIN users u ON u.id = jp.posted_by
     ORDER BY jp.created_at DESC`
  );
  return result.rows;
}

async function createCandidate({ jobPostingId, name, email, phone, resumeUrl }) {
  const result = await pool.query(
    `INSERT INTO candidates (job_posting_id, name, email, phone, resume_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [jobPostingId, name, email, phone || null, resumeUrl || null]
  );
  return result.rows[0];
}

async function getCandidatesByJob(jobId) {
  const result = await pool.query(
    'SELECT * FROM candidates WHERE job_posting_id = $1 ORDER BY created_at DESC',
    [jobId]
  );
  return result.rows;
}

async function updateCandidateStatus(id, status) {
  const result = await pool.query(
    'UPDATE candidates SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0] || null;
}

module.exports = {
  createJobPosting,
  getJobPostings,
  createCandidate,
  getCandidatesByJob,
  updateCandidateStatus,
};