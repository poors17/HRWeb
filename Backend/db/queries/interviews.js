const pool = require('../../config/db');

async function scheduleInterview({ candidateId, interviewerId, scheduledAt }) {
  const result = await pool.query(
    `INSERT INTO interviews (candidate_id, interviewer_id, scheduled_at, result)
     VALUES ($1, $2, $3, 'Pending')
     RETURNING *`,
    [candidateId, interviewerId, scheduledAt]
  );
  return result.rows[0];
}

async function getInterviewsByCandidate(candidateId) {
  const result = await pool.query(
    `SELECT i.*, u.name AS interviewer_name, c.name AS candidate_name
     FROM interviews i
     LEFT JOIN users u ON u.id = i.interviewer_id
     LEFT JOIN candidates c ON c.id = i.candidate_id
     WHERE i.candidate_id = $1
     ORDER BY i.scheduled_at DESC`,
    [candidateId]
  );
  return result.rows;
}

async function submitFeedback(id, feedback, result) {
  const queryResult = await pool.query(
    `UPDATE interviews
     SET feedback = $1, result = $2
     WHERE id = $3
     RETURNING *`,
    [feedback, result, id]
  );
  return queryResult.rows[0] || null;
}

module.exports = { scheduleInterview, getInterviewsByCandidate, submitFeedback };