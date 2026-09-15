const assets = require('../db/queries/assets');
const logAction = require('../middleware/auditLogger');

const assetStatuses = ['Available', 'Assigned', 'Under Repair', 'Retired'];

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23503') return res.status(400).json({ message: 'A referenced record does not exist' });
  if (error.code === '23505') return res.status(409).json({ message: 'An asset with that code already exists' });
  if (error.code === 'ASSET_UNAVAILABLE') return res.status(409).json({ message: error.message });
  return res.status(500).json({ message });
}

async function createAsset(req, res) {
  const {
    asset_code: assetCode,
    asset_type: assetType,
    serial_number: serialNumber,
    purchase_date: purchaseDate,
    purchase_value: purchaseValue,
    status,
  } = req.body;
  if (!assetCode || !assetType || (status && !assetStatuses.includes(status))) {
    return res.status(400).json({ message: 'asset_code and asset_type are required with a valid status' });
  }
  try {
    const asset = await assets.createAsset({ assetCode, assetType, serialNumber, purchaseDate, purchaseValue, status });
    logAction(req, 'CREATE', 'Asset', asset.id, `Created asset ${asset.asset_code}`);
    return res.status(201).json(asset);
  } catch (error) {
    return handleError(res, error, 'Unable to create asset');
  }
}

async function getAllAssets(req, res) {
  try {
    return res.json(await assets.getAllAssets());
  } catch (error) {
    return handleError(res, error, 'Unable to fetch assets');
  }
}

async function assignAsset(req, res) {
  const employeeId = req.body.employee_id ?? req.body.employeeId;
  if (!employeeId) return res.status(400).json({ message: 'employee_id is required' });
  try {
    const assignment = await assets.assignAsset(req.params.id, employeeId, {
      assignedDate: req.body.assigned_date,
      acknowledged: req.body.acknowledged,
      conditionNotes: req.body.condition_notes,
    });
    if (!assignment) return res.status(404).json({ message: 'Asset not found' });
    logAction(req, 'CREATE', 'Asset', req.params.id, `Assigned asset to employee ${employeeId}`);
    return res.status(201).json(assignment);
  } catch (error) {
    return handleError(res, error, 'Unable to assign asset');
  }
}

async function returnAsset(req, res) {
  try {
    const assignment = await assets.returnAsset(req.params.id, req.body.returned_date);
    if (!assignment) return res.status(404).json({ message: 'No active assignment found for this asset' });
    return res.json(assignment);
  } catch (error) {
    return handleError(res, error, 'Unable to return asset');
  }
}

async function transferAsset(req, res) {
  const employeeId = req.body.employee_id ?? req.body.employeeId;
  if (!employeeId) return res.status(400).json({ message: 'employee_id is required' });
  try {
    const assignment = await assets.transferAsset(req.params.id, employeeId, {
      assignedDate: req.body.assigned_date,
      acknowledged: req.body.acknowledged,
      conditionNotes: req.body.condition_notes,
    });
    if (!assignment) return res.status(404).json({ message: 'No active assignment found for this asset' });
    return res.status(201).json(assignment);
  } catch (error) {
    return handleError(res, error, 'Unable to transfer asset');
  }
}

async function getMyAssets(req, res) {
  try {
    const employeeId = await assets.getEmployeeIdByUserId(req.user.id);
    if (!employeeId) return res.status(404).json({ message: 'No employee record is linked to this user' });
    return res.json(await assets.getAssetsByEmployee(employeeId));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch assigned assets');
  }
}

async function getAssetHistory(req, res) {
  try {
    return res.json(await assets.getAssetHistory(req.params.id));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch asset history');
  }
}

module.exports = {
  createAsset,
  getAllAssets,
  assignAsset,
  returnAsset,
  transferAsset,
  getMyAssets,
  getAssetHistory,
};