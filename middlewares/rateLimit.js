// Import rate limiting library
const rateLimit = require('express-rate-limit');

// Rate limiter for authenticated users - 100 requests per minute (per API contract)
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests — please try again later',
    },
  },
});

// Rate limiter for public endpoints - 20 requests per minute (per API contract)
const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests — please try again later',
    },
  },
});

// Export both limiters
module.exports = { authLimiter, publicLimiter };
