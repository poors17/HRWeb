const express = require('express');
const authenticateToken = require('../middleware/auth');
const requireRoles = require('../middleware/roleCheck');
const {
  createJobPosting,
  getJobPostings,
  createCandidate,
  getCandidatesByJob,
  updateCandidateStatus,
} = require('../controllers/recruitmentController');

const router = express.Router();
const hrRoles = requireRoles('HR', 'Super Admin');

router.use(authenticateToken);
router.post('/job-postings', hrRoles, createJobPosting);
router.get('/job-postings', getJobPostings);
router.post('/candidates', createCandidate);
router.get('/candidates/job/:jobId', getCandidatesByJob);
router.patch('/candidates/:id/status', hrRoles, updateCandidateStatus);

module.exports = router;