const certifications = require('../db/queries/certifications');
const performance = require('../db/queries/performance');

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23503') return res.status(400).json({ message: 'A referenced employee does not exist' });
  return res.status(500).json({ message });
}

async function employeeIdForRequest(req, res) {
  const employeeId = await performance.getEmployeeIdByUserId(req.user.id);
  if (!employeeId) {
    res.status(404).json({ message: 'No employee record is linked to this user' });
    return null;
  }
  return employeeId;
}

async function addCertification(req, res) {
  const { name, issued_date: issuedDate, expiry_date: expiryDate, certificate_url: certificateUrl } = req.body;
  if (!name) return res.status(400).json({ message: 'name is required' });
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    return res.status(201).json(await certifications.createCertification({ employeeId, name: name.trim(), issuedDate, expiryDate, certificateUrl }));
  } catch (error) {
    return handleError(res, error, 'Unable to add certification');
  }
}

async function getMyCertifications(req, res) {
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    return res.json(await certifications.getCertificationsByEmployee(employeeId));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch certifications');
  }
}

async function getExpiringCertifications(req, res) {
  const daysAhead = Number(req.query.days_ahead ?? req.query.daysAhead ?? 30);
  if (!Number.isInteger(daysAhead) || daysAhead < 0) return res.status(400).json({ message: 'days_ahead must be a non-negative integer' });
  try {
    return res.json(await certifications.getExpiringCertifications(daysAhead));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch expiring certifications');
  }
}

module.exports = { addCertification, getMyCertifications, getExpiringCertifications };