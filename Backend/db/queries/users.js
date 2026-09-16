const pool = require('../../config/db');

async function countUsers() {
  const result = await pool.query('SELECT COUNT(*)::int AS count FROM users');
  return result.rows[0].count;
}

async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.password_hash, u.role_id, u.is_active,
            u.refresh_token, r.name AS role
     FROM users u
     LEFT JOIN roles r ON r.id = u.role_id
     WHERE LOWER(u.email) = LOWER($1)`,
    [email]
  );

  return result.rows[0] || null;
}

async function createUser({ name, email, passwordHash, roleId }) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, role_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role_id, is_active, created_at`,
    [name, email, passwordHash, roleId]
  );

  return result.rows[0];
}

async function updateRefreshToken(userId, refreshToken) {
  await pool.query(
    'UPDATE users SET refresh_token = $1, updated_at = NOW() WHERE id = $2',
    [refreshToken, userId]
  );
}

async function findUserById(id) {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.password_hash, u.role_id, u.is_active,
            u.refresh_token, r.name AS role
     FROM users u
     LEFT JOIN roles r ON r.id = u.role_id
     WHERE u.id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  countUsers,
  findUserByEmail,
  createUser,
  updateRefreshToken,
  findUserById,
};
