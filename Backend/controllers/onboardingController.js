const onboarding = require('../db/queries/onboarding');

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23503') return res.status(400).json({ message: 'A referenced employee does not exist' });
  return res.status(500).json({ message });
}

async function createOnboardingTasks(req, res) {
  const employeeId = req.body.employee_id ?? req.body.employeeId;
  const taskList = req.body.taskList ?? req.body.task_list;
  if (!employeeId || !Array.isArray(taskList) || !taskList.length) {
    return res.status(400).json({ message: 'employee_id and a non-empty taskList are required' });
  }
  if (taskList.some((task) => !(typeof task === 'string' ? task.trim() : (task.task_name || task.taskName)))) {
    return res.status(400).json({ message: 'Each onboarding task must have a task name' });
  }

  try {
    return res.status(201).json(await onboarding.createOnboardingTasks(employeeId, taskList));
  } catch (error) {
    return handleError(res, error, 'Unable to create onboarding tasks');
  }
}

async function getMyOnboardingTasks(req, res) {
  try {
    const employeeId = await onboarding.getEmployeeIdByUserId(req.user.id);
    if (!employeeId) return res.status(404).json({ message: 'No employee record is linked to this user' });
    return res.json(await onboarding.getTasksByEmployee(employeeId));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch onboarding tasks');
  }
}

async function markTaskComplete(req, res) {
  try {
    const employeeId = await onboarding.getEmployeeIdByUserId(req.user.id);
    if (!employeeId) return res.status(404).json({ message: 'No employee record is linked to this user' });
    const task = await onboarding.markTaskComplete(req.params.id, employeeId);
    if (!task) return res.status(404).json({ message: 'Onboarding task not found' });
    return res.json(task);
  } catch (error) {
    return handleError(res, error, 'Unable to complete onboarding task');
  }
}

module.exports = { createOnboardingTasks, getMyOnboardingTasks, markTaskComplete };