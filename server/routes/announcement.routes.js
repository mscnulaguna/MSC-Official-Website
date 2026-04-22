// Import Express and announcement controller functions
// const express = require('express');
import express from 'express';
const { listAnnouncements, createNewAnnouncement } = require('../controllers/announcement.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// Create router instance
const router = express.Router();

// Public read announcements
router.get('/', listAnnouncements);

// Create announcements (officers/admins only)
router.post('/', authMiddleware, roleMiddleware(['officer', 'admin']), createNewAnnouncement);

// Export announcement router
module.exports = router;
