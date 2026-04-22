// Import Express and admin controller functions
// const express = require('express');
import express from 'express';
const {
  createUserWithTempPassword,
  getAllUsersList,
  getUserDetails,
  updateUserDetails,
  bulkCreateUsers,
  resetUserTemporaryPassword,
  bulkPasswordReset,
  sendCredentialsToUsers,
} = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// Create router instance
const router = express.Router();

// All admin routes require authentication and admin role
// Create user with temporary password
router.post('/users', authMiddleware, adminMiddleware, createUserWithTempPassword);

// Bulk create users from CSV data
router.post('/users/bulk/import', authMiddleware, adminMiddleware, bulkCreateUsers);

// Get all users (paginated with filters)
router.get('/users', authMiddleware, adminMiddleware, getAllUsersList);

// Get user details by ID
router.get('/users/:userId', authMiddleware, adminMiddleware, getUserDetails);

// Update user details
router.put('/users/:userId', authMiddleware, adminMiddleware, updateUserDetails);

// Reset temporary password for a user (generates fresh temp password)
router.post('/users/:userId/reset-temporary-password', authMiddleware, adminMiddleware, resetUserTemporaryPassword);

// Bulk reset passwords for multiple users
router.post('/users/bulk-reset', authMiddleware, adminMiddleware, bulkPasswordReset);

// Send login credentials email to selected users
router.post('/users/send-credentials', authMiddleware, adminMiddleware, sendCredentialsToUsers);

// Export admin router
module.exports = router;
