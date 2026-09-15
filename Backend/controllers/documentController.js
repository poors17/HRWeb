const documents = require('../db/queries/documents');

const verificationStatuses = ['Pending', 'Verified', 'Rejected'];

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23503') return res.status(400).json({ message: 'A referenced record does not exist' });
  if (error.code === '23505') return res.status(409).json({ message: 'A document category with that name already exists' });
  return res.status(500).json({ message });
}

async function employeeIdForRequest(req, res) {
  const employeeId = await documents.getEmployeeIdByUserId(req.user.id);
  if (!employeeId) {
    res.status(404).json({ message: 'No employee record is linked to this user' });
    return null;
  }
  return employeeId;
}

async function createCategory(req, res) {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ message: 'name is required' });
  try {
    return res.status(201).json(await documents.createCategory(name.trim()));
  } catch (error) {
    return handleError(res, error, 'Unable to create document category');
  }
}

async function getCategories(req, res) {
  try {
    return res.json(await documents.getAllCategories());
  } catch (error) {
    return handleError(res, error, 'Unable to fetch document categories');
  }
}

async function uploadDocument(req, res) {
  const {
    file_url: fileUrl,
    file_name: fileName,
    category_id: categoryId,
    issue_date: issueDate,
    expiry_date: expiryDate,
  } = req.body;
  if (!fileUrl || !categoryId) return res.status(400).json({ message: 'file_url and category_id are required' });
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    return res.status(201).json(await documents.uploadDocument({
      employeeId,
      categoryId,
      fileUrl,
      fileName,
      issueDate,
      expiryDate,
      uploadedBy: req.user.id,
    }));
  } catch (error) {
    return handleError(res, error, 'Unable to upload document metadata');
  }
}

async function getMyDocuments(req, res) {
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    return res.json(await documents.getDocumentsByEmployee(employeeId));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch employee documents');
  }
}

async function getEmployeeDocuments(req, res) {
  try {
    return res.json(await documents.getDocumentsByEmployee(req.params.employeeId));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch employee documents');
  }
}

async function verifyDocument(req, res) {
  const { verification_status: status } = req.body;
  if (!verificationStatuses.includes(status)) {
    return res.status(400).json({ message: 'verification_status must be Pending, Verified, or Rejected' });
  }
  try {
    const document = await documents.updateVerificationStatus(req.params.id, status, req.user.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });
    return res.json(document);
  } catch (error) {
    return handleError(res, error, 'Unable to update document verification status');
  }
}

async function getExpiringDocuments(req, res) {
  const daysAhead = Number(req.query.days_ahead ?? req.query.daysAhead ?? 30);
  if (!Number.isInteger(daysAhead) || daysAhead < 0) {
    return res.status(400).json({ message: 'days_ahead must be a non-negative integer' });
  }
  try {
    return res.json(await documents.getExpiringDocuments(daysAhead));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch expiring documents');
  }
}

async function deleteDocument(req, res) {
  try {
    const document = await documents.getDocumentById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    if (Number(document.employee_id) !== Number(employeeId)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    await documents.deleteDocument(req.params.id);
    return res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    return handleError(res, error, 'Unable to delete document');
  }
}

module.exports = {
  createCategory,
  getCategories,
  uploadDocument,
  getMyDocuments,
  getEmployeeDocuments,
  verifyDocument,
  getExpiringDocuments,
  deleteDocument,
};