// Check if user has required role permissions
const roleMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    // Verify user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    // Get user's role from JWT
    const userRole = req.user.role;

    // Check if user's role is in allowed list
    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions for this action',
        },
      });
    }

    next();
  };
};

// Export role checking middleware
module.exports = roleMiddleware;
