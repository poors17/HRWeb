const express = require('express');
const authenticateToken = require('../middleware/auth');
const requireRoles = require('../middleware/roleCheck');
const {
  createCategory,
  getCategories,
  uploadDocument,
  getMyDocuments,
  getEmployeeDocuments,
  verifyDocument,
  getExpiringDocuments,
  deleteDocument,
} = require('../controllers/documentController');

const router = express.Router();
const documentAdminRoles = requireRoles('HR', 'Super Admin');

router.use(authenticateToken);
router.post('/categories', documentAdminRoles, createCategory);
router.get('/categories', getCategories);
router.post('/upload', uploadDocument);
router.get('/my', getMyDocuments);
router.get('/employee/:employeeId', documentAdminRoles, getEmployeeDocuments);
router.patch('/:id/verify', documentAdminRoles, verifyDocument);
router.get('/expiring', documentAdminRoles, getExpiringDocuments);
router.delete('/:id', deleteDocument);

module.exports = router;