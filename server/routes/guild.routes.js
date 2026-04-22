// Import Express and guild controller functions
// const express = require('express');
import express from 'express';
const {
  listGuilds,
  getGuild,
  getGuildResourcesHandler,
  applyToGuild,
  approveGuildApplication,
} = require('../controllers/guild.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// Create router instance
const router = express.Router();

// Public guild browsing
router.get('/', listGuilds);
router.get('/:slug', getGuild);

// Guild member operations
router.post('/:slug/apply', authMiddleware, applyToGuild);
router.get('/:slug/resources', authMiddleware, getGuildResourcesHandler);

// Admin approval of guild applications
router.post('/:userId/approve', authMiddleware, roleMiddleware(['admin']), approveGuildApplication);

// Export guild router
module.exports = router;
