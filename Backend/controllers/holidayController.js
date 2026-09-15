const holidays = require('../db/queries/holidays');

function handleError(res, error, message) {
  console.error(`${message}:`, error.message);
  if (error.code === '23505') return res.status(409).json({ message: 'A holiday already exists for that date' });
  return res.status(500).json({ message });
}

async function createHoliday(req, res) {
  const { name, date } = req.body;
  if (!name || !date) return res.status(400).json({ message: 'name and date are required' });
  try {
    return res.status(201).json(await holidays.createHoliday({ name: name.trim(), date }));
  } catch (error) {
    return handleError(res, error, 'Unable to create holiday');
  }
}

async function getAllHolidays(req, res) {
  try {
    return res.json(await holidays.getAllHolidays());
  } catch (error) {
    return handleError(res, error, 'Unable to fetch holidays');
  }
}

module.exports = { createHoliday, getAllHolidays };