const express = require('express');
const authenticateToken = require('../middleware/auth');
const { getSummary } = require('../controllers/dashboardController');

const router = express.Router();

router.use(authenticateToken);
router.get('/summary', getSummary);

module.exports = router;