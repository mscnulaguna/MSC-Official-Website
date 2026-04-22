// Import Express and event controller functions
// const express = require('express');
import express from 'express';
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const {
  getAllEventsHandler,
  getEventByIdHandler,
  createNewEvent,
  registerForEvent,
  markAttendanceHandler,
  getAttendanceHandler,
  uploadEventCoverImage,
} = require('../controllers/event.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const eventCoversDir = path.join(__dirname, '../uploads/event-covers');
if (!fs.existsSync(eventCoversDir)) {
  fs.mkdirSync(eventCoversDir, { recursive: true });
}

// Setup multer for event cover images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, eventCoversDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `cover-${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept image files only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Create router instance
const router = express.Router();

// Public read endpoints
router.get('/', getAllEventsHandler);
router.get('/:id', getEventByIdHandler);

// Event creation (officers/admins only)
router.post('/', authMiddleware, roleMiddleware(['officer', 'admin']), createNewEvent);

// Event cover image upload (officers/admins only)
router.post('/upload/cover', authMiddleware, roleMiddleware(['officer', 'admin']), upload.single('coverImage'), uploadEventCoverImage);

// Event registration (members only)
router.post('/:id/register', authMiddleware, registerForEvent);

// Attendance management (officers/admins only)
router.post('/:id/attendance', authMiddleware, roleMiddleware(['officer', 'admin']), markAttendanceHandler);
router.get('/:id/attendance', authMiddleware, roleMiddleware(['officer', 'admin']), getAttendanceHandler);

// Export event router
module.exports = router;
