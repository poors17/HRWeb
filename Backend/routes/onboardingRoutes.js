const express = require('express');
const authenticateToken = require('../middleware/auth');
const {
  createOnboardingTasks,
  getMyOnboardingTasks,
  markTaskComplete,
} = require('../controllers/onboardingController');

const router = express.Router();

router.use(authenticateToken);
router.post('/tasks', createOnboardingTasks);
router.get('/my-tasks', getMyOnboardingTasks);
router.patch('/tasks/:id/complete', markTaskComplete);

module.exports = router;