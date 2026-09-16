const express = require('express');
const authenticateToken = require('../middleware/auth');
const { getSummary, getMyDashboardSummary } = require('../controllers/dashboardController');

const router = express.Router();

router.use(authenticateToken);
router.get('/summary', getSummary);
router.get('/my-summary', getMyDashboardSummary);

module.exports = router;