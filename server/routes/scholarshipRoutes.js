const express = require('express');
const router = express.Router();
const {
  getAllScholarships,
  getMatchedScholarships,
  getScholarshipById,
  getDeadlineReminders,
} = require('../controllers/scholarshipController');
const { protect } = require('../middleware/authMiddleware');

// Public route to fetch all scholarships
router.get('/', getAllScholarships);

// Protected routes (Must be defined before /:id)
router.get('/matched', protect, getMatchedScholarships);
router.get('/reminders', protect, getDeadlineReminders);

// Public route to fetch single scholarship by ID
router.get('/:id', getScholarshipById);

module.exports = router;
