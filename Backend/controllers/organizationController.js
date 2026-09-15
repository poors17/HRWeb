const departments = require('../db/queries/departments');
const designations = require('../db/queries/designations');
const branches = require('../db/queries/branches');
const shifts = require('../db/queries/shifts');

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23505') return res.status(409).json({ message: 'A record with that value already exists' });
  if (error.code === '23503') return res.status(400).json({ message: 'A referenced record does not exist' });
  return res.status(500).json({ message });
}

function createHandlers(query, label, requiredFields) {
  return {
    create: async (req, res) => {
      if (requiredFields.some((field) => !req.body[field])) {
        return res.status(400).json({ message: `${requiredFields.join(' and ')} ${requiredFields.length === 1 ? 'is' : 'are'} required` });
      }
      try {
        return res.status(201).json(await query.create(req.body));
      } catch (error) {
        return handleError(res, error, `Unable to create ${label}`);
      }
    },
    getAll: async (req, res) => {
      try {
        return res.json(await query.getAll());
      } catch (error) {
        return handleError(res, error, `Unable to fetch ${label}`);
      }
    },
  };
}

const departmentHandlers = createHandlers(
  { create: departments.createDepartment, getAll: departments.getAllDepartments },
  'departments',
  ['name']
);
const designationHandlers = createHandlers(
  { create: designations.createDesignation, getAll: designations.getAllDesignations },
  'designations',
  ['name']
);
const branchHandlers = createHandlers(
  { create: branches.createBranch, getAll: branches.getAllBranches },
  'branches',
  ['name']
);
const shiftHandlers = createHandlers(
  { create: shifts.createShift, getAll: shifts.getAllShifts },
  'shifts',
  ['name', 'start_time', 'end_time']
);

module.exports = {
  createDepartment: departmentHandlers.create,
  getAllDepartments: departmentHandlers.getAll,
  createDesignation: designationHandlers.create,
  getAllDesignations: designationHandlers.getAll,
  createBranch: branchHandlers.create,
  getAllBranches: branchHandlers.getAll,
  createShift: shiftHandlers.create,
  getAllShifts: shiftHandlers.getAll,
};