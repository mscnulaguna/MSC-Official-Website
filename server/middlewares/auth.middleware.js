// Import JWT library for token verification
const jwt = require('jsonwebtoken');

// Verify JWT token from Authorization header
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if token exists in header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing or invalid JWT token',
        },
      });
    }

    // Fail fast if JWT secret is not configured
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'JWT secret is not configured',
        },
      });
    }

    // Extract token and verify it
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store decoded user info in request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      },
    });
  }
};

// Export auth middleware function
module.exports = authMiddleware;
