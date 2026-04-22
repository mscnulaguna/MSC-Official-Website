// const express = require('express');
import express from 'express';
const {
  syncUserHandler,
  bulkSyncHandler,
  jobStatusHandler,
  statusHandler,
} = require('../controllers/integration.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

// All integration endpoints require a valid session AND admin role
const adminOnly = [authMiddleware, roleMiddleware(['admin'])];

// NOTE: /sync/bulk MUST be declared before /sync/:userId to prevent Express
// matching the literal string "bulk" as a userId path parameter.
router.post('/sharepoint/sync/bulk', ...adminOnly, bulkSyncHandler);
router.post('/sharepoint/sync/:userId', ...adminOnly, syncUserHandler);
router.get('/sharepoint/jobs/:jobId', ...adminOnly, jobStatusHandler);
router.get('/sharepoint/status', ...adminOnly, statusHandler);

module.exports = router;
