// Import Express and user controller functions
const express = require('express');
const { getMe, updateMe, uploadProfilePhoto, getAvatarPresets, selectAvatar, listAllMembers, updateUserRole, deactivateUser } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const upload = require('../config/multer');

// Create router instance
const router = express.Router();

// Get current user profile
router.get('/me', authMiddleware, getMe);

// Update current user profile
router.patch('/me', authMiddleware, updateMe);

// Upload profile photo
router.post('/me/photo', authMiddleware, upload.single('photo'), uploadProfilePhoto);

// Get available avatars
router.get('/avatars', authMiddleware, getAvatarPresets);

// Select avatar
router.post('/me/avatar', authMiddleware, selectAvatar);

// List all members (officers and admins only)
router.get('/', authMiddleware, roleMiddleware(['officer', 'admin']), listAllMembers);

// Admin endpoints for user management
router.patch('/:userId/role', authMiddleware, roleMiddleware(['admin']), updateUserRole);
router.post('/:userId/deactivate', authMiddleware, roleMiddleware(['admin']), deactivateUser);

// Export user router
module.exports = router;
