// Import necessary dependencies
const bcrypt = require('bcryptjs');
const { syncInBackground } = require('../services/sharepoint.service');
const { sendWelcomeEmail, sendWelcomeEmailSafe } = require('../services/email.service');
const {
  createUser,
  findUserByEmail,
  findUserByStudentId,
  getAllUsers,
  findUserById,
  updateUser,
  bulkResetPasswords,
} = require('../models/user.model');

// Generate random temporary password
function generateTemporaryPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  
  // Ensure at least one uppercase and one number
  password += 'MSC';
  password += Math.floor(Math.random() * 9000) + 1000;
  
  // Add random characters to make it longer
  for (let i = 0; i < 4; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return password;
}

// Create a new user with temporary password (Admin only)
async function createUserWithTempPassword(req, res) {
  try {
    const { email, fullName, studentId, yearLevel, course, role } = req.body;

    // Validate required fields
    if (!email || !fullName || !studentId || !yearLevel || !course) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'All fields required: email, fullName, studentId, yearLevel, course',
        },
      });
    }

    // Validate email domain
    if (!email.endsWith('@students.nu-laguna.edu.ph')) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email must end with @students.nu-laguna.edu.ph',
        },
      });
    }

    // Check if email already exists
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'Email already registered',
        },
      });
    }

    // Check if student ID already exists
    const existingStudentId = await findUserByStudentId(studentId);
    if (existingStudentId) {
      return res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'Student ID already registered',
        },
      });
    }

    // Validate role if provided
    const validRoles = ['member', 'officer', 'admin'];
    const userRole = role && validRoles.includes(role) ? role : 'member';

    // Generate temporary password
    const tempPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    const hashedTemporaryPassword = await bcrypt.hash(tempPassword, 10);

    // Create user
    const user = await createUser({
      email,
      password: hashedPassword,
      fullName,
      studentId,
      yearLevel,
      course,
      role: userRole,
      temporaryPassword: hashedTemporaryPassword,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully with temporary password',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        studentId: user.studentId,
        yearLevel: user.yearLevel,
        course: user.course,
        role: user.role,
      },
      temporaryPassword: tempPassword,
      note: 'Share this temporary password with the user. They will be required to change it on first login.',
    });

    // Auto-sync new member to SharePoint (fire-and-forget — never blocks response)
    syncInBackground(user.id);
  } catch (error) {
    console.error('User creation error:', error.message);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create user',
      },
    });
  }
}

// Get all users (Admin only)
async function getAllUsersList(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const role = req.query.role;

    const filters = {};
    if (role) {
      filters.role = role;
    }

    const result = await getAllUsers(page, pageSize, filters);

    res.status(200).json({
      success: true,
      data: result.data.map(user => ({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        studentId: user.studentId,
        yearLevel: user.yearLevel,
        course: user.course,
        role: user.role,
        isActive: user.isActive,
        requiresPasswordChange: user.requiresPasswordChange,
        created_at: user.created_at,
      })),
      pagination: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: Math.ceil(result.total / result.pageSize),
      },
    });
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch users',
      },
    });
  }
}

// Get user details by ID (Admin only)
async function getUserDetails(req, res) {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'User ID is required',
        },
      });
    }

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        studentId: user.studentId,
        yearLevel: user.yearLevel,
        course: user.course,
        role: user.role,
        isActive: user.isActive,
        requiresPasswordChange: user.requiresPasswordChange,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    console.error('Get user error:', error.message);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch user',
      },
    });
  }
}

// Update user details (Admin only) - fullName, yearLevel, course, role
async function updateUserDetails(req, res) {
  try {
    const userId = req.params.userId;
    const { fullName, yearLevel, course, role, isActive } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'User ID is required',
        },
      });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    // Build update object with provided fields
    const updates = {};
    if (fullName) updates.fullName = fullName;
    if (yearLevel) updates.yearLevel = yearLevel;
    if (course) updates.course = course;
    if (role) updates.role = role;
    if (isActive !== undefined) updates.isActive = isActive;

    const updatedUser = await updateUser(userId, updates);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
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
    console.error('Update user error:', error.message);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update user',
      },
    });
  }
}

// Bulk create users from CSV data
async function bulkCreateUsers(req, res) {
  try {
    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Users array is required and must not be empty',
        },
      });
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < users.length; i++) {
      try {
        const { email, fullName, studentId, yearLevel, course, role } = users[i];

        // Validate required fields
        if (!email || !fullName || !studentId || !yearLevel || !course) {
          errors.push({
            row: i + 1,
            error: 'Missing required fields: email, fullName, studentId, yearLevel, course',
          });
          continue;
        }

        // Validate email domain
        if (!email.endsWith('@students.nu-laguna.edu.ph')) {
          errors.push({
            row: i + 1,
            email,
            error: 'Email must end with @students.nu-laguna.edu.ph',
          });
          continue;
        }

        // Check if email already exists
        const existingEmail = await findUserByEmail(email);
        if (existingEmail) {
          errors.push({
            row: i + 1,
            email,
            error: 'Email already registered',
          });
          continue;
        }

        // Check if student ID already exists
        const existingStudentId = await findUserByStudentId(studentId);
        if (existingStudentId) {
          errors.push({
            row: i + 1,
            studentId,
            error: 'Student ID already registered',
          });
          continue;
        }

        // Generate temporary password
        const tempPassword = generateTemporaryPassword();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const hashedTemporaryPassword = await bcrypt.hash(tempPassword, 10);

        // Create user
        const user = await createUser({
          email,
          password: hashedPassword,
          fullName,
          studentId,
          yearLevel: parseInt(yearLevel),
          course,
          role: role || 'member',
          temporaryPassword: hashedTemporaryPassword,
        });

        results.push({
          email: user.email,
          temporaryPassword: tempPassword,
          fullName: user.fullName,
          studentId: user.studentId,
        });
      } catch (error) {
        errors.push({
          row: i + 1,
          error: error.message || 'Failed to create user',
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Successfully created ${results.length} users`,
      created: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Bulk user creation error:', error.message);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create users in bulk',
      },
    });
  }
}

// Reset temporary password for a user (Admin only)
// Generates a new temporary password and returns it plaintext (one time only).
// Callers should immediately send this to the user via email or secure channel.
async function resetUserTemporaryPassword(req, res) {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'User ID is required',
        },
      });
    }

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    // Generate a fresh temporary password, store only its hash, and return the plaintext once.
    // This avoids returning a stored bcrypt hash and ensures the plaintext is never persisted.
    const tempPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    await bulkResetPasswords([{ userId, tempPassword, hashedPassword }]);

    res.status(200).json({
      success: true,
      message: 'Temporary password reset successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      temporaryPassword: tempPassword,
      note: 'Share this temporary password with the user. They will be required to change it on first login.',
    });
  } catch (error) {
    console.error('Reset temporary password error:', error.message);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to reset temporary password',
      },
    });
  }
}

// Bulk reset passwords for multiple users (Admin only)
async function bulkPasswordReset(req, res) {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'userIds array is required' },
      });
    }

    const results = [];
    const errors = [];

    for (const userId of userIds) {
      try {
        const user = await findUserById(userId);
        if (!user) {
          errors.push({ userId, error: 'User not found' });
          continue;
        }

        const tempPassword = generateTemporaryPassword();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const hashedTemporaryPassword = await bcrypt.hash(tempPassword, 10);

        await bulkResetPasswords([{ userId, hashedTemporaryPassword, hashedPassword }]);

        results.push({
          userId: user.id,
          email: user.email,
          fullName: user.fullName,
          temporaryPassword: tempPassword,
        });
      } catch (err) {
        errors.push({ userId, error: err.message });
      }
    }

    res.status(200).json({
      success: true,
      message: `Reset passwords for ${results.length} user(s)`,
      reset: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Bulk password reset error:', error.message);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to reset passwords' },
    });
  }
}

// Send login credentials email to selected users (Admin only)
// Uses existing temp password if available, otherwise generates a fresh one
async function sendCredentialsToUsers(req, res) {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'userIds array is required' },
      });
    }

    const sent = [];
    const failed = [];

    for (const userId of userIds) {
      try {
        const user = await findUserById(userId);
        if (!user) {
          failed.push({ userId, error: 'User not found' });
          continue;
        }

        // Always generate a fresh temp password: stored value is a bcrypt hash and
        // cannot be recovered as plaintext. Reset the account and email the new plaintext once.
        const tempPassword = generateTemporaryPassword();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        await bulkResetPasswords([{ userId, tempPassword, hashedPassword }]);

        // Await so we can accurately report per-user success vs failure
        await sendWelcomeEmail(user, tempPassword);

        sent.push({ userId: String(user.id), email: user.email, fullName: user.fullName });
      } catch (err) {
        failed.push({ userId: String(userId), error: err.message || 'Failed to send email' });
      }
    }

    res.status(200).json({
      success: true,
      message: `Credentials sent to ${sent.length} user(s)`,
      sent: sent.length,
      failed: failed.length,
      results: sent,
      errors: failed.length > 0 ? failed : undefined,
    });
  } catch (error) {
    console.error('Send credentials error:', error.message);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to send credentials' },
    });
  }
}

module.exports = {
  createUserWithTempPassword,
  getAllUsersList,
  getUserDetails,
  updateUserDetails,
  bulkCreateUsers,
  resetUserTemporaryPassword,
  bulkPasswordReset,
  sendCredentialsToUsers,
};
