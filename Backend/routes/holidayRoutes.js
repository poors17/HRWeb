const express = require('express');
const authenticateToken = require('../middleware/auth');
const holidays = require('../controllers/holidayController');

const router = express.Router();

router.use(authenticateToken);
router.post('/', holidays.createHoliday);
router.get('/', holidays.getAllHolidays);

module.exports = router;