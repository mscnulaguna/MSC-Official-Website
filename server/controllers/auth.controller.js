// Import JWT and password hashing libraries
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  findUserByEmail,
  findUserByStudentId,
  findUserById,
  createUser,
  verifyPassword,
  updateUser,
  updateUserPassword,
  clearTemporaryPassword,
} = require('../models/user.model');

// JWT secrets for token signing (required)
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be configured');
}

// Generate access and refresh tokens for authenticated user
function generateTokens(user) {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
}

// Verify email is from valid student domain
function validateEmail(email) {
  const validDomain = '@students.nu-laguna.edu.ph';
  return email.endsWith(validDomain);
}

// Check password meets security requirements
function validatePassword(password) {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least 1 uppercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least 1 number' };
  }

  return { valid: true };
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required',
        },
      });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        },
      });
    }

    // Authenticate using the primary password hash only.
    // Temp passwords are treated as the initial account password,
    // while requiresPasswordChange remains the gate to force rotation.
    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        },
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Convert requiresPasswordChange from MySQL boolean (0/1) to JavaScript boolean
    const requiresPasswordChange = Boolean(user.requiresPasswordChange);

    res.status(200).json({
      success: true,
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        studentId: user.studentId,
        yearLevel: user.yearLevel,
        course: user.course,
        role: user.role,
        requiresPasswordChange: requiresPasswordChange,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to login',
      },
    });
  }
}

async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Refresh token is required',
        },
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired refresh token',
        },
      });
    }

    const user = await findUserByEmail(decoded.email);

    if (!user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not found',
        },
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.status(200).json({
      success: true,
      token: accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired refresh token',
      },
    });
  }
}

async function logout(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Refresh token is required',
        },
      });
    }

    // In a production app, you'd add the token to a blacklist or revocation table
    // For now, just verify it's valid and acknowledge logout

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to logout',
      },
    });
  }
}

// Change user password - for authenticated users (first-time password change)
async function changePassword(req, res) {
  try {
    const { newPassword } = req.body;
    const userId = req.user.id; // From auth middleware - user is already authenticated

    // Validate new password
    if (!newPassword) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'New password is required',
        },
      });
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: passwordValidation.message,
        },
      });
    }

    // Get user
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    // Update password and mark as password change complete
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(userId, hashedPassword);
    
    // Clear the temporary password and mark requiresPasswordChange as false
    await clearTemporaryPassword(userId);
    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to change password',
      },
    });
  }
}

// Update user profile information
async function updateProfile(req, res) {
  try {
    const userId = req.user.id; // From auth middleware
    const { fullName } = req.body;

    // Validate fullName is provided
    if (!fullName) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Full name is required',
        },
      });
    }

    // Validate fullName is not empty
    if (fullName.trim().length === 0) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Full name cannot be empty',
        },
      });
    }

    // Update user profile
    const updatedUser = await updateUser(userId, { fullName });

    if (!updatedUser) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        studentId: updatedUser.studentId,
        yearLevel: updatedUser.yearLevel,
        course: updatedUser.course,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error.message);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update profile',
      },
    });
  }
}

module.exports = {
  login,
  refresh,
  logout,
  changePassword,
  updateProfile,
};
