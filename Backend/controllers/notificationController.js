const notifications = require('../db/queries/notifications');

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  return res.status(500).json({ message });
}

async function getMyNotifications(req, res) {
  try {
    return res.json(await notifications.getNotificationsByUser(req.user.id));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch notifications');
  }
}

async function markNotificationRead(req, res) {
  try {
    const notification = await notifications.markAsRead(req.params.id, req.user.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    return res.json(notification);
  } catch (error) {
    return handleError(res, error, 'Unable to mark notification as read');
  }
}

async function markAllRead(req, res) {
  try {
    return res.json({ notifications: await notifications.markAllAsRead(req.user.id) });
  } catch (error) {
    return handleError(res, error, 'Unable to mark notifications as read');
  }
}

async function getUnreadCount(req, res) {
  try {
    return res.json({ count: await notifications.getUnreadCount(req.user.id) });
  } catch (error) {
    return handleError(res, error, 'Unable to fetch unread notification count');
  }
}

module.exports = { getMyNotifications, markNotificationRead, markAllRead, getUnreadCount };