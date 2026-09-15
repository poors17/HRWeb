const pool = require('../../config/db');

async function createNotification({ userId, title, message, type, referenceId }) {
  const result = await pool.query(
    `INSERT INTO notifications (user_id, title, message, type, reference_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, title, message, type || null, referenceId || null]
  );
  return result.rows[0];
}

async function getNotificationsByUser(userId) {
  const result = await pool.query(
    `SELECT * FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC, id DESC`,
    [userId]
  );
  return result.rows;
}

async function markAsRead(id, userId) {
  const result = await pool.query(
    `UPDATE notifications SET is_read = true
     WHERE id = $1 AND ($2::INTEGER IS NULL OR user_id = $2)
     RETURNING *`,
    [id, userId || null]
  );
  return result.rows[0] || null;
}

async function markAllAsRead(userId) {
  const result = await pool.query(
    `UPDATE notifications SET is_read = true
     WHERE user_id = $1 AND is_read = false
     RETURNING *`,
    [userId]
  );
  return result.rows;
}

async function getUnreadCount(userId) {
  const result = await pool.query(
    'SELECT COUNT(*)::INTEGER AS count FROM notifications WHERE user_id = $1 AND is_read = false',
    [userId]
  );
  return result.rows[0].count;
}

async function createAnnouncement({ title, message, postedBy }) {
  const result = await pool.query(
    `INSERT INTO announcements (title, message, posted_by)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, message, postedBy]
  );
  return result.rows[0];
}

async function getAllAnnouncements() {
  const result = await pool.query(
    `SELECT a.*, u.name AS posted_by_name
     FROM announcements a
     LEFT JOIN users u ON u.id = a.posted_by
     ORDER BY a.created_at DESC, a.id DESC`
  );
  return result.rows;
}

module.exports = {
  createNotification,
  getNotificationsByUser,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  createAnnouncement,
  getAllAnnouncements,
};