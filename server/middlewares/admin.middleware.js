// Admin-only middleware - checks if user has admin role
const adminMiddleware = (req, res, next) => {
  // Verify user is authenticated (auth middleware should run first)
  if (!req.user) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
  }

  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'Admin access required',
      },
    });
  }

  next();
};

module.exports = adminMiddleware;
