const express = require('express');
const authenticateToken = require('../middleware/auth');
const requireRoles = require('../middleware/roleCheck');
const {
  createAnnouncement,
  getAnnouncements,
} = require('../controllers/announcementController');

const router = express.Router();

router.use(authenticateToken);
router.post('/', requireRoles('HR', 'Super Admin'), createAnnouncement);
router.get('/', getAnnouncements);

module.exports = router;