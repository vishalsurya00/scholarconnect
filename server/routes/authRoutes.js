const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateName } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected auth routes
router.get('/me', protect, getMe);
router.put('/update-name', protect, updateName);

module.exports = router;
