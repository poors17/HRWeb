const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  findUserByEmail,
  createUser,
  updateRefreshToken,
  findUserById,
} = require('../db/queries/users');
const { findEmployeeByCode } = require('../db/queries/employees');

function createAccessToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    employeeId: user.employee_id,
    employeeCode: user.employee_code,
  };
}

function validEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function signup(req, res) {
  const { name, email, password, roleId } = req.body;

  if (!name || !validEmail(email) || typeof password !== 'string' || password.length < 8 || !roleId) {
    return res.status(400).json({
      message: 'Name, valid email, password (minimum 8 characters), and roleId are required',
    });
  }

  try {
    if (await findUserByEmail(email)) {
      return res.status(409).json({ message: 'A user with that email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      roleId,
    });

    return res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Signup error:', error.message);
    return res.status(500).json({ message: 'Unable to create user' });
  }
}

async function login(req, res) {
  const { employeeId, password } = req.body;

  if (typeof employeeId !== 'string' || !employeeId.trim() || typeof password !== 'string' || !password) {
    return res.status(400).json({ message: 'Employee ID and password are required' });
  }

  try {
    const user = await findEmployeeByCode(employeeId.trim());
    if (!user || !user.is_active || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid employee ID or password' });
    }

    const token = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    await updateRefreshToken(user.id, refreshToken);

    return res.json({ token, refreshToken, user: publicUser(user) });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Unable to log in' });
  }
}

async function refreshToken(req, res) {
  const { refreshToken: token } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await findUserById(decoded.id);

    if (!user || !user.is_active || user.refresh_token !== token) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    return res.json({ token: createAccessToken(user) });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
}

async function logout(req, res) {
  try {
    await updateRefreshToken(req.user.id, null);
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error.message);
    return res.status(500).json({ message: 'Unable to log out' });
  }
}

module.exports = {
  signup,
  login,
  refreshToken,
  logout,
};