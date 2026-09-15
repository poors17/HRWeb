const { createAuditLog } = require('../db/queries/auditLogs');

async function logAction(req, action, module, recordId, description) {
  try {
    return await createAuditLog({
      userId: req.user?.id,
      action,
      module,
      recordId,
      description,
      ipAddress: req.ip,
    });
  } catch (error) {
    console.error('Unable to create audit log:', error.message);
    return null;
  }
}

module.exports = logAction;