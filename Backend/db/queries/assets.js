const pool = require('../../config/db');

async function createAsset({ assetCode, assetType, serialNumber, purchaseDate, purchaseValue, status }) {
  const result = await pool.query(
    `INSERT INTO assets
       (asset_code, asset_type, serial_number, purchase_date, purchase_value, status)
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'Available'))
     RETURNING *`,
    [assetCode, assetType, serialNumber || null, purchaseDate || null, purchaseValue ?? null, status || null]
  );
  return result.rows[0];
}

async function getAllAssets() {
  const result = await pool.query(
    `SELECT a.*, e.employee_code, e.full_name, aa.assigned_date, aa.acknowledged
     FROM assets a
     LEFT JOIN asset_assignments aa ON aa.asset_id = a.id AND aa.returned_date IS NULL
     LEFT JOIN employees e ON e.id = aa.employee_id
     ORDER BY a.asset_code`
  );
  return result.rows;
}

async function assignAsset(assetId, employeeId, { assignedDate, acknowledged, conditionNotes } = {}) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const asset = await client.query('SELECT * FROM assets WHERE id = $1 FOR UPDATE', [assetId]);
    if (!asset.rows[0]) {
      await client.query('ROLLBACK');
      return null;
    }
    if (asset.rows[0].status !== 'Available') {
      const error = new Error('Asset is not available for assignment');
      error.code = 'ASSET_UNAVAILABLE';
      throw error;
    }
    const assignment = await client.query(
      `INSERT INTO asset_assignments
         (asset_id, employee_id, assigned_date, acknowledged, condition_notes)
       VALUES ($1, $2, COALESCE($3, CURRENT_DATE), COALESCE($4, false), $5)
       RETURNING *`,
      [assetId, employeeId, assignedDate || null, acknowledged, conditionNotes || null]
    );
    await client.query("UPDATE assets SET status = 'Assigned' WHERE id = $1", [assetId]);
    await client.query('COMMIT');
    return assignment.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function returnAsset(assetId, returnedDate) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const assignment = await client.query(
      `UPDATE asset_assignments
       SET returned_date = COALESCE($2, CURRENT_DATE)
       WHERE id = (
         SELECT id FROM asset_assignments
         WHERE asset_id = $1 AND returned_date IS NULL
         ORDER BY assigned_date DESC, id DESC LIMIT 1
       )
       RETURNING *`,
      [assetId, returnedDate || null]
    );
    if (!assignment.rows[0]) {
      await client.query('ROLLBACK');
      return null;
    }
    await client.query("UPDATE assets SET status = 'Available' WHERE id = $1", [assetId]);
    await client.query('COMMIT');
    return assignment.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function transferAsset(assetId, employeeId, { assignedDate, acknowledged, conditionNotes } = {}) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const current = await client.query(
      `UPDATE asset_assignments
       SET returned_date = COALESCE($2, CURRENT_DATE)
       WHERE id = (
         SELECT id FROM asset_assignments
         WHERE asset_id = $1 AND returned_date IS NULL
         ORDER BY assigned_date DESC, id DESC LIMIT 1
       )
       RETURNING *`,
      [assetId, assignedDate || null]
    );
    if (!current.rows[0]) {
      await client.query('ROLLBACK');
      return null;
    }
    const next = await client.query(
      `INSERT INTO asset_assignments
         (asset_id, employee_id, assigned_date, acknowledged, condition_notes)
       VALUES ($1, $2, COALESCE($3, CURRENT_DATE), COALESCE($4, false), $5)
       RETURNING *`,
      [assetId, employeeId, assignedDate || null, acknowledged, conditionNotes || null]
    );
    await client.query("UPDATE assets SET status = 'Assigned' WHERE id = $1", [assetId]);
    await client.query('COMMIT');
    return next.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function getAssetHistory(assetId) {
  const result = await pool.query(
    `SELECT aa.*, e.employee_code, e.full_name, a.asset_code, a.asset_type
     FROM asset_assignments aa
     JOIN assets a ON a.id = aa.asset_id
     JOIN employees e ON e.id = aa.employee_id
     WHERE aa.asset_id = $1
     ORDER BY aa.assigned_date DESC, aa.id DESC`,
    [assetId]
  );
  return result.rows;
}

async function getAssetsByEmployee(employeeId) {
  const result = await pool.query(
    `SELECT a.*, aa.id AS assignment_id, aa.assigned_date, aa.returned_date,
            aa.acknowledged, aa.condition_notes
     FROM asset_assignments aa
     JOIN assets a ON a.id = aa.asset_id
     WHERE aa.employee_id = $1
     ORDER BY aa.assigned_date DESC, aa.id DESC`,
    [employeeId]
  );
  return result.rows;
}

async function getEmployeeIdByUserId(userId) {
  const result = await pool.query('SELECT id FROM employees WHERE user_id = $1', [userId]);
  return result.rows[0]?.id || null;
}

module.exports = {
  createAsset,
  getAllAssets,
  assignAsset,
  returnAsset,
  transferAsset,
  getAssetHistory,
  getAssetsByEmployee,
  getEmployeeIdByUserId,
};