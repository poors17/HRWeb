const express = require('express');
const authenticateToken = require('../middleware/auth');
const {
  addCertification,
  getMyCertifications,
  getExpiringCertifications,
} = require('../controllers/certificationController');

const router = express.Router();

router.use(authenticateToken);
router.post('/', addCertification);
router.get('/my', getMyCertifications);
router.get('/expiring', getExpiringCertifications);

module.exports = router;