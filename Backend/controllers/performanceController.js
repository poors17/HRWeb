const performance = require('../db/queries/performance');

const cycleStatuses = ['Active', 'Closed'];
const reviewStatuses = ['Pending', 'Self-Reviewed', 'Manager-Reviewed', 'Finalized'];

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23503') return res.status(400).json({ message: 'A referenced record does not exist' });
  return res.status(500).json({ message });
}

async function employeeIdForRequest(req, res) {
  const employeeId = await performance.getEmployeeIdByUserId(req.user.id);
  if (!employeeId) {
    res.status(404).json({ message: 'No employee record is linked to this user' });
    return null;
  }
  return employeeId;
}

async function createCycle(req, res) {
  const { name, start_date: startDate, end_date: endDate, status } = req.body;
  if (!name || !startDate || !endDate || (status && !cycleStatuses.includes(status))) {
    return res.status(400).json({ message: 'name, start_date, end_date, and a valid status are required' });
  }
  if (startDate > endDate) return res.status(400).json({ message: 'start_date must be before or equal to end_date' });
  try {
    return res.status(201).json(await performance.createCycle({ name: name.trim(), startDate, endDate, status }));
  } catch (error) {
    return handleError(res, error, 'Unable to create performance cycle');
  }
}

async function createGoal(req, res) {
  const { cycle_id: cycleId, employee_id: employeeId, title, description, target, weightage } = req.body;
  if (!cycleId || !employeeId || !title) return res.status(400).json({ message: 'cycle_id, employee_id, and title are required' });
  try {
    return res.status(201).json(await performance.createGoal({ cycleId, employeeId, title: title.trim(), description, target, weightage }));
  } catch (error) {
    return handleError(res, error, 'Unable to create performance goal');
  }
}

async function getMyGoals(req, res) {
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    return res.json(await performance.getGoalsByEmployee(employeeId));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch performance goals');
  }
}

async function submitSelfReview(req, res) {
  const { cycle_id: cycleId, self_review: selfReview } = req.body;
  if (!cycleId || !selfReview) return res.status(400).json({ message: 'cycle_id and self_review are required' });
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    const existing = await performance.getReviewByCycleAndEmployee(cycleId, employeeId);
    const review = existing
      ? await performance.updateReview(existing.id, { self_review: selfReview, status: 'Self-Reviewed' })
      : await performance.createReview({ cycleId, employeeId, selfReview, status: 'Self-Reviewed' });
    return res.status(existing ? 200 : 201).json(review);
  } catch (error) {
    return handleError(res, error, 'Unable to submit self review');
  }
}

async function submitManagerReview(req, res) {
  const { review_id: reviewId, manager_review: managerReview, rating } = req.body;
  if (!reviewId || !managerReview || rating === undefined) {
    return res.status(400).json({ message: 'review_id, manager_review, and rating are required' });
  }
  if (!Number.isFinite(Number(rating)) || Number(rating) < 0 || Number(rating) > 5) {
    return res.status(400).json({ message: 'rating must be between 0 and 5' });
  }
  try {
    const review = await performance.updateReview(reviewId, {
      manager_review: managerReview,
      rating: Number(rating),
      reviewed_by: req.user.id,
      status: 'Manager-Reviewed',
    });
    if (!review) return res.status(404).json({ message: 'Performance review not found' });
    return res.json(review);
  } catch (error) {
    return handleError(res, error, 'Unable to submit manager review');
  }
}

async function finalizeReview(req, res) {
  const { final_outcome: finalOutcome, rating } = req.body;
  if (!finalOutcome) return res.status(400).json({ message: 'final_outcome is required' });
  if (rating !== undefined && (!Number.isFinite(Number(rating)) || Number(rating) < 0 || Number(rating) > 5)) {
    return res.status(400).json({ message: 'rating must be between 0 and 5' });
  }
  try {
    const review = await performance.updateReview(req.params.id, {
      final_outcome: finalOutcome,
      rating: rating === undefined ? undefined : Number(rating),
      reviewed_by: req.user.id,
      status: 'Finalized',
    });
    if (!review) return res.status(404).json({ message: 'Performance review not found' });
    return res.json(review);
  } catch (error) {
    return handleError(res, error, 'Unable to finalize performance review');
  }
}

async function getMyReviews(req, res) {
  try {
    const employeeId = await employeeIdForRequest(req, res);
    if (!employeeId) return null;
    return res.json(await performance.getReviewsByEmployee(employeeId));
  } catch (error) {
    return handleError(res, error, 'Unable to fetch performance reviews');
  }
}

module.exports = {
  createCycle,
  createGoal,
  getMyGoals,
  submitSelfReview,
  submitManagerReview,
  finalizeReview,
  getMyReviews,
};