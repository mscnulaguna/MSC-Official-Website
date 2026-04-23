// Import dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const { publicLimiter, authLimiter } = require('./middlewares/rateLimit');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes');
const eventRoutes = require('./routes/event.routes');
const guildRoutes = require('./routes/guild.routes');
const announcementRoutes = require('./routes/announcement.routes');
const partnerRoutes = require('./routes/partner.routes');
const integrationRoutes = require('./routes/integration.routes');

// Create Express app
const app = express();

// App is deployed behind nginx in Docker, so trust proxy headers from it.
app.set('trust proxy', 1);

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

// Compatibility endpoints used by the frontend startup check
app.get(['/api/hello', '/api/v1/hello'], (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// Apply rate limiter to all /api/v1 routes (100 req/min)
// Login and refresh apply the stricter publicLimiter (20/min) on top of this
app.use('/api/v1', authLimiter);

// Mount all API route modules
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/guilds', guildRoutes);
app.use('/api/v1/announcements', announcementRoutes);
app.use('/api/v1/partners', partnerRoutes);
app.use('/api/v1/integrations', integrationRoutes);

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
module.exports = app;
