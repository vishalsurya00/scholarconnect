const express = require('express');
const router = express.Router();
const {
  getChecklistByScholarship,
  updateChecklist,
  getAllUserChecklists,
} = require('../controllers/checklistController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected by JWT authentication
router.use(protect);

// GET all checklists for logged-in user (Dashboard tracker)
router.get('/', getAllUserChecklists);

// GET checklist for a specific scholarship
router.get('/:scholarshipId', getChecklistByScholarship);

// PUT update checklist for a specific scholarship (toggle docs or mark applied)
router.put('/:scholarshipId', updateChecklist);

module.exports = router;
