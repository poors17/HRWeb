const pool = require('../../config/db');

async function createOnboardingTasks(employeeId, taskList) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const tasks = [];
    for (const task of taskList) {
      const taskName = typeof task === 'string' ? task : task.task_name || task.taskName;
      const dueDate = typeof task === 'string' ? null : task.due_date || task.dueDate || null;
      const result = await client.query(
        `INSERT INTO onboarding_tasks (employee_id, task_name, due_date)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [employeeId, taskName, dueDate]
      );
      tasks.push(result.rows[0]);
    }
    await client.query('COMMIT');
    return tasks;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function getTasksByEmployee(employeeId) {
  const result = await pool.query(
    'SELECT * FROM onboarding_tasks WHERE employee_id = $1 ORDER BY is_completed, due_date NULLS LAST, id',
    [employeeId]
  );
  return result.rows;
}

async function markTaskComplete(taskId, employeeId) {
  const result = await pool.query(
    `UPDATE onboarding_tasks
     SET is_completed = true
     WHERE id = $1 AND employee_id = $2
     RETURNING *`,
    [taskId, employeeId]
  );
  return result.rows[0] || null;
}

async function getEmployeeIdByUserId(userId) {
  const result = await pool.query('SELECT id FROM employees WHERE user_id = $1', [userId]);
  return result.rows[0]?.id || null;
}

module.exports = {
  createOnboardingTasks,
  getTasksByEmployee,
  markTaskComplete,
  getEmployeeIdByUserId,
};