const express = require('express');
const authenticateToken = require('../middleware/auth');
const requireRoles = require('../middleware/roleCheck');
const {
  createAsset,
  getAllAssets,
  assignAsset,
  returnAsset,
  transferAsset,
  getMyAssets,
  getAssetHistory,
} = require('../controllers/assetController');

const router = express.Router();
const assetAdminRoles = requireRoles('HR', 'Super Admin');

router.use(authenticateToken);
router.post('/', assetAdminRoles, createAsset);
router.get('/', getAllAssets);
router.post('/:id/assign', assetAdminRoles, assignAsset);
router.post('/:id/return', returnAsset);
router.post('/:id/transfer', transferAsset);
router.get('/my', getMyAssets);
router.get('/:id/history', getAssetHistory);

module.exports = router;