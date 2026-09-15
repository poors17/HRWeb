const { createNotification } = require('../db/queries/notifications');

async function notifyUser(userId, title, message, type, referenceId) {
  if (!userId) return null;
  try {
    return await createNotification({ userId, title, message, type, referenceId });
  } catch (error) {
    console.error('Unable to create notification:', error.message);
    return null;
  }
}

module.exports = notifyUser;