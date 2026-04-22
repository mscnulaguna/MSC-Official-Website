// Import dependencies
// const express = require('express');
const cors = require('cors');
const path = require('path');
const { publicLimiter, authLimiter } = require('../middlewares/rateLimit');
import express from 'express';
// import cors from 'cors';
// import path from 'path';
// import { publicLimiter, authLimiter } from './middlewares/rateLimit.js';

// Create Express app
const app = express();

// Parse JSON and URL-encoded request bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enable CORS for cross-origin requests with explicit options
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite default (client/ in MSC-Official-Website repo)
    'http://localhost:3000', // Alternative dev port
    'http://localhost:3001',
    'http://localhost:80',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files only from the dedicated public directory
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly expose only intended upload/public asset directories
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/event-covers', express.static(path.join(__dirname, 'uploads', 'event-covers')));
app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars'), {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    }
  }
}));

// Serve the testing frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/frontend-test.html');
});

app.get('/test', (req, res) => {
  res.sendFile(__dirname + '/frontend-test.html');
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Apply rate limiter to all /api/v1 routes (100 req/min)
// Login and refresh apply the stricter publicLimiter (20/min) on top of this
app.use('/api/v1', authLimiter);

// Mount all API route modules
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/admin', require('./routes/admin.routes'));
app.use('/api/v1/users', require('./routes/user.routes.js'));
app.use('/api/v1/events', require('./routes/event.routes'));
app.use('/api/v1/guilds', require('./routes/guild.routes'));
app.use('/api/v1/announcements', require('./routes/announcement.routes'));
app.use('/api/v1/partners', require('./routes/partner.routes'));
app.use('/api/v1/integrations', require('./routes/integration.routes'));

// Catch-all 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong!',
    },
  });
});

// Export the configured Express app
export default app;
