const pool = require('../../config/db');

async function createAuditLog({ userId, action, module, recordId, description, ipAddress }) {
  const result = await pool.query(
    `INSERT INTO audit_logs
       (user_id, action, module, record_id, description, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId || null, action, module, recordId || null, description || null, ipAddress || null]
  );
  return result.rows[0];
}

async function getAuditLogs(filters = {}) {
  const conditions = [];
  const values = [];
  if (filters.module) {
    values.push(filters.module);
    conditions.push(`al.module = $${values.length}`);
  }
  if (filters.userId) {
    values.push(filters.userId);
    conditions.push(`al.user_id = $${values.length}`);
  }
  if (filters.startDate) {
    values.push(filters.startDate);
    conditions.push(`al.created_at >= $${values.length}::date`);
  }
  if (filters.endDate) {
    values.push(filters.endDate);
    conditions.push(`al.created_at < ($${values.length}::date + INTERVAL '1 day')`);
  }

  const result = await pool.query(
    `SELECT al.*, u.name AS user_name, u.email AS user_email
     FROM audit_logs al
     LEFT JOIN users u ON u.id = al.user_id
     ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
     ORDER BY al.created_at DESC, al.id DESC`,
    values
  );
  return result.rows;
}

async function getAuditLogsByRecord(module, recordId) {
  const result = await pool.query(
    `SELECT al.*, u.name AS user_name, u.email AS user_email
     FROM audit_logs al
     LEFT JOIN users u ON u.id = al.user_id
     WHERE al.module = $1 AND al.record_id = $2
     ORDER BY al.created_at DESC, al.id DESC`,
    [module, recordId]
  );
  return result.rows;
}

module.exports = { createAuditLog, getAuditLogs, getAuditLogsByRecord };