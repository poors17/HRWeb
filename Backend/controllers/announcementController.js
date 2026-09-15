const notifications = require('../db/queries/notifications');

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23503') return res.status(400).json({ message: 'A referenced user does not exist' });
  return res.status(500).json({ message });
}

async function createAnnouncement(req, res) {
  const { title, message } = req.body;
  if (!title || !message) return res.status(400).json({ message: 'title and message are required' });
  try {
    return res.status(201).json(await notifications.createAnnouncement({
      title: title.trim(),
      message,
      postedBy: req.user.id,
    }));
  } catch (error) {
    return handleError(res, error, 'Unable to create announcement');
  }
}

async function getAnnouncements(req, res) {
  try {
    return res.json(await notifications.getAllAnnouncements());
  } catch (error) {
    return handleError(res, error, 'Unable to fetch announcements');
  }
}

module.exports = { createAnnouncement, getAnnouncements };