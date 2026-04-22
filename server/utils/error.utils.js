// Standardized error response utilities for consistent API error handling

// Define all error codes with HTTP status and default message
const errorCodes = {
  // 400 - Bad Request
  VALIDATION_ERROR: {
    status: 400,
    message: 'Request validation failed'
  },

  // 401 - Unauthorized
  UNAUTHORIZED: {
    status: 401,
    message: 'Missing or invalid authentication token'
  },
  INVALID_TOKEN: {
    status: 401,
    message: 'Invalid or expired token'
  },

  // 403 - Forbidden
  FORBIDDEN: {
    status: 403,
    message: 'Insufficient permissions for this action'
  },

  // 404 - Not Found
  NOT_FOUND: {
    status: 404,
    message: 'Requested resource not found'
  },

  // 409 - Conflict
  CONFLICT: {
    status: 409,
    message: 'Resource already exists or conflicts with existing data'
  },
  DUPLICATE_REGISTRATION: {
    status: 409,
    message: 'User is already registered for this event'
  },

  // 422 - Unprocessable Entity
  CAPACITY_FULL: {
    status: 422,
    message: 'Event capacity is full'
  },

  // 429 - Too Many Requests
  RATE_LIMITED: {
    status: 429,
    message: 'Too many requests, please try again later'
  },

  // 500 - Internal Server Error
  INTERNAL_ERROR: {
    status: 500,
    message: 'An unexpected server error occurred'
  }
};

/**
 * Send error response with standardized format
 * @param {Object} res - Express response object
 * @param {string} code - Error code key from errorCodes
 * @param {string} customMessage - Optional custom message
 * @param {Object} details - Optional additional details (not exposed to client)
 */
function sendError(res, code, customMessage = null, details = null) {
  const errorConfig = errorCodes[code];

  if (!errorConfig) {
    console.error(`Unknown error code: ${code}`);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: errorCodes.INTERNAL_ERROR.message
      }
    });
  }

  const response = {
    error: {
      code,
      message: customMessage || errorConfig.message
    }
  };

  // Log details server-side if provided
  if (details) {
    console.error(`[${code}]`, details);
  }

  return res.status(errorConfig.status).json(response);
}

/**
 * Validation error helper
 * @param {Object} res - Express response object
 * @param {string} message - Validation error message
 */
function validationError(res, message) {
  return sendError(res, 'VALIDATION_ERROR', message);
}

/**
 * Authentication error helper
 * @param {Object} res - Express response object
 * @param {string} message - Custom message (optional)
 */
function unauthorizedError(res, message = null) {
  return sendError(res, 'UNAUTHORIZED', message);
}

/**
 * Authorization error helper
 * @param {Object} res - Express response object
 * @param {string} message - Custom message (optional)
 */
function forbiddenError(res, message = null) {
  return sendError(res, 'FORBIDDEN', message);
}

/**
 * Not found error helper
 * @param {Object} res - Express response object
 * @param {string} resource - Resource name
 */
function notFoundError(res, resource) {
  return sendError(res, 'NOT_FOUND', `${resource} not found`);
}

/**
 * Conflict error helper
 * @param {Object} res - Express response object
 * @param {string} message - Custom message (optional)
 */
function conflictError(res, message = null) {
  return sendError(res, 'CONFLICT', message);
}

/**
 * Capacity full error helper
 * @param {Object} res - Express response object
 */
function capacityFullError(res) {
  return sendError(res, 'CAPACITY_FULL');
}

/**
 * Rate limited error helper
 * @param {Object} res - Express response object
 */
function rateLimitedError(res) {
  return sendError(res, 'RATE_LIMITED');
}

/**
 * Internal error helper
 * @param {Object} res - Express response object
 * @param {Error} err - Error object for logging
 */
function internalError(res, err = null) {
  if (err) {
    console.error('Internal Server Error:', err);
  }
  return sendError(res, 'INTERNAL_ERROR');
}

module.exports = {
  errorCodes,
  sendError,
  validationError,
  unauthorizedError,
  forbiddenError,
  notFoundError,
  conflictError,
  capacityFullError,
  rateLimitedError,
  internalError
};
