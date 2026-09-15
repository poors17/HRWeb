const express = require('express');
const authenticateToken = require('../middleware/auth');
const {
  getMyNotifications,
  markNotificationRead,
  markAllRead,
  getUnreadCount,
} = require('../controllers/notificationController');

const router = express.Router();

router.use(authenticateToken);
router.get('/my', getMyNotifications);
router.patch('/:id/read', markNotificationRead);
router.patch('/read-all', markAllRead);
router.get('/unread-count', getUnreadCount);

module.exports = router;