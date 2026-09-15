const express = require('express');
const authenticateToken = require('../middleware/auth');
const requireRoles = require('../middleware/roleCheck');
const {
  createCycle,
  createGoal,
  getMyGoals,
  submitSelfReview,
  submitManagerReview,
  finalizeReview,
  getMyReviews,
} = require('../controllers/performanceController');

const router = express.Router();
const managementRoles = requireRoles('HR', 'Manager', 'Super Admin');

router.use(authenticateToken);
router.post('/cycles', managementRoles, createCycle);
router.post('/goals', managementRoles, createGoal);
router.get('/my-goals', getMyGoals);
router.post('/reviews/self', submitSelfReview);
router.post('/reviews/manager', submitManagerReview);
router.patch('/reviews/:id/finalize', finalizeReview);
router.get('/my-reviews', getMyReviews);

module.exports = router;