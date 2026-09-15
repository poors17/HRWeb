const express = require('express');
const authenticateToken = require('../middleware/auth');
const {
  scheduleInterview,
  getInterviewsByCandidate,
  submitFeedback,
} = require('../controllers/interviewController');

const router = express.Router();

router.use(authenticateToken);
router.post('/', scheduleInterview);
router.get('/candidate/:candidateId', getInterviewsByCandidate);
router.patch('/:id/feedback', submitFeedback);

module.exports = router;