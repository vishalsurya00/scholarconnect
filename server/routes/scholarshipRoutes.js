const express = require('express');
const router = express.Router();
const {
  getAllScholarships,
  getMatchedScholarships,
  getScholarshipById,
} = require('../controllers/scholarshipController');
const { protect } = require('../middleware/authMiddleware');

// Public route to fetch all scholarships
router.get('/', getAllScholarships);

// Protected route to compute personalized 3-tier matches for logged-in user
// (Must be defined before /:id)
router.get('/matched', protect, getMatchedScholarships);

// Public route to fetch single scholarship by ID
router.get('/:id', getScholarshipById);

module.exports = router;
