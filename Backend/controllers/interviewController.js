const interviews = require('../db/queries/interviews');

const interviewResults = ['Pending', 'Passed', 'Failed'];

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23503') return res.status(400).json({ message: 'A referenced record does not exist' });
  return res.status(500).json({ message });
}

async function scheduleInterview(req, res) {
  const {
    candidate_id: candidateId,
    interviewer_id: interviewerId,
    scheduled_at: scheduledAt,
  } = req.body;
  if (!candidateId || !interviewerId || !scheduledAt) {
    return res.status(400).json({ message: 'candidate_id, interviewer_id, and scheduled_at are required' });
  }

  try {
    return res.status(201).json(await interviews.scheduleInterview({ candidateId, interviewerId, scheduledAt }));
  } catch (error) {
    return handleError(res, error, 'Unable to schedule interview');
  }
}

async function getInterviewsByCandidate(req, res) {
  try {
    return res.json(await interviews.getInterviewsByCandidate(req.params.candidateId));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch interviews');
  }
}

async function submitFeedback(req, res) {
  const { feedback, result } = req.body;
  if (!interviewResults.includes(result)) {
    return res.status(400).json({ message: 'result must be Pending, Passed, or Failed' });
  }

  try {
    const interview = await interviews.submitFeedback(req.params.id, feedback || null, result);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    return res.json(interview);
  } catch (error) {
    return handleError(res, error, 'Unable to submit interview feedback');
  }
}

module.exports = { scheduleInterview, getInterviewsByCandidate, submitFeedback };