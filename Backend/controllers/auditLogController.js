const { getAuditLogs } = require('../db/queries/auditLogs');

function handleError(res, error) {
  console.error('Unable to fetch audit logs:', error.message);
  return res.status(500).json({ message: 'Unable to fetch audit logs' });
}

async function getLogs(req, res) {
  try {
    return res.json(await getAuditLogs({
      module: req.query.module,
      userId: req.query.userId ?? req.query.user_id,
      startDate: req.query.startDate ?? req.query.start_date,
      endDate: req.query.endDate ?? req.query.end_date,
    }));
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = { getLogs };