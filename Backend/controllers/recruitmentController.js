const recruitment = require('../db/queries/recruitment');

const candidateStatuses = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];
const postingStatuses = ['Open', 'Closed', 'On Hold'];

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23503') return res.status(400).json({ message: 'A referenced record does not exist' });
  return res.status(500).json({ message });
}

async function createJobPosting(req, res) {
  const { title, department_id: departmentId, description, status } = req.body;
  if (!title || (status && !postingStatuses.includes(status))) {
    return res.status(400).json({ message: 'title is required and status must be Open, Closed, or On Hold' });
  }

  try {
    return res.status(201).json(await recruitment.createJobPosting({
      title: title.trim(),
      departmentId,
      description,
      status,
      postedBy: req.user.id,
    }));
  } catch (error) {
    return handleError(res, error, 'Unable to create job posting');
  }
}

async function getJobPostings(req, res) {
  try {
    return res.json(await recruitment.getJobPostings());
  } catch (error) {
    return handleError(res, error, 'Unable to fetch job postings');
  }
}

async function createCandidate(req, res) {
  const {
    job_posting_id: jobPostingId,
    name,
    email,
    phone,
    resume_url: resumeUrl,
  } = req.body;
  if (!jobPostingId || !name || !email) {
    return res.status(400).json({ message: 'job_posting_id, name, and email are required' });
  }

  try {
    return res.status(201).json(await recruitment.createCandidate({
      jobPostingId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone,
      resumeUrl,
    }));
  } catch (error) {
    return handleError(res, error, 'Unable to create candidate');
  }
}

async function getCandidatesByJob(req, res) {
  try {
    return res.json(await recruitment.getCandidatesByJob(req.params.jobId));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch candidates');
  }
}

async function updateCandidateStatus(req, res) {
  const { status } = req.body;
  if (!candidateStatuses.includes(status)) {
    return res.status(400).json({ message: 'status must be Applied, Shortlisted, Interview Scheduled, Selected, or Rejected' });
  }

  try {
    const candidate = await recruitment.updateCandidateStatus(req.params.id, status);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    return res.json(candidate);
  } catch (error) {
    return handleError(res, error, 'Unable to update candidate status');
  }
}

module.exports = {
  createJobPosting,
  getJobPostings,
  createCandidate,
  getCandidatesByJob,
  updateCandidateStatus,
};