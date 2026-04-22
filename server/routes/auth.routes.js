// Import Express and auth controller functions
const express = require('express');
const { login, refresh, logout, changePassword, updateProfile } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { publicLimiter } = require('../middlewares/rateLimit');

// Create router instance
const router = express.Router();

// Public auth endpoints with rate limiting
router.post('/login', publicLimiter, login);
router.post('/refresh', publicLimiter, refresh);

// Protected endpoints require authentication
router.post('/logout', authMiddleware, logout);
router.post('/change-password', authMiddleware, changePassword);
router.put('/profile', authMiddleware, updateProfile);

// Export auth router
module.exports = router;
