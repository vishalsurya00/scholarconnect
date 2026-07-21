const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const {
  getAdminStats,
  getAdminScholarships,
  createScholarship,
  updateScholarship,
  deleteScholarship,
} = require('../controllers/adminController');

// Protect all admin routes with JWT auth & Admin middleware
router.use(protect);
router.use(admin);

router.get('/stats', getAdminStats);
router.get('/scholarships', getAdminScholarships);
router.post('/scholarships', createScholarship);
router.put('/scholarships/:id', updateScholarship);
router.delete('/scholarships/:id', deleteScholarship);

module.exports = router;
