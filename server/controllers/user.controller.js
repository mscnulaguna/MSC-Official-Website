// Import user database functions
const { findUserById, getAllUsers, updateUser, getUserGuilds, getBulkUserGuilds } = require('../models/user.model');
const { syncInBackground } = require('../../services/sharepoint.service');
const { AVATAR_PRESETS } = require('../../utils/avatars');
const QRCode = require('qrcode');

// Get current authenticated user profile
async function getMe(req, res) {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    // Generate QR code as data URL using qrcode library
    const qrData = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/members/${user.studentId}`;
    const qrCode = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Format memberSince as ISO 8601
    const memberSince = user.created_at instanceof Date 
      ? user.created_at.toISOString() 
      : new Date(user.created_at).toISOString();

    const userGuilds = await getUserGuilds(user.id);

    res.status(200).json({
      user: {
        id: String(user.id),
        email: user.email,
        fullName: user.fullName,
        studentId: user.studentId,
        yearLevel: user.yearLevel,
        course: user.course,
        role: user.role,
        qrCode: qrCode,
        memberSince: memberSince,
        profilePhoto: user.profilePhoto || null,
        emergencyContact: user.emergencyContact || null,
        contactNumber: user.contactNumber || null,
        requiresPasswordChange: Boolean(user.requiresPasswordChange),
        guilds: userGuilds.map(g => ({ id: String(g.id), name: g.name, slug: g.slug }))
      }
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch profile',
      },
    });
  }
}

async function updateMe(req, res) {
  try {
    const { fullName, yearLevel, course, profilePhoto, emergencyContact, contactNumber } = req.body;

    const updatedUser = await updateUser(req.user.id, {
      fullName,
      yearLevel,
      course,
      profilePhoto,
      emergencyContact,
      contactNumber,
    });

    // Generate QR code as data URL using qrcode library
    const qrData = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/members/${updatedUser.studentId}`;
    const qrCode = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Format memberSince as ISO 8601
    const memberSince = updatedUser.created_at instanceof Date 
      ? updatedUser.created_at.toISOString() 
      : new Date(updatedUser.created_at).toISOString();

    const userGuilds = await getUserGuilds(req.user.id);

    res.status(200).json({
      user: {
        id: String(updatedUser.id),
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        studentId: updatedUser.studentId,
        yearLevel: updatedUser.yearLevel,
        course: updatedUser.course,
        role: updatedUser.role,
        qrCode: qrCode,
        memberSince: memberSince,
        profilePhoto: updatedUser.profilePhoto || null,
        emergencyContact: updatedUser.emergencyContact || null,
        contactNumber: updatedUser.contactNumber || null,
        requiresPasswordChange: Boolean(updatedUser.requiresPasswordChange),
        guilds: userGuilds.map(g => ({ id: String(g.id), name: g.name, slug: g.slug }))
      }
    });

    // Auto-sync profile changes to SharePoint (fire-and-forget)
    syncInBackground(req.user.id, { fields: ['FullName', 'YearLevel', 'Course'] });
  } catch (error) {
    console.error('Error in updateMe:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update profile',
      },
    });
  }
}

async function listAllMembers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize) || 20, 100);
    const filters = {
      role: req.query.role,
      guild: req.query.guild,
    };

    const result = await getAllUsers(page, pageSize, filters);

    const userIds = result.data.map(u => u.id);
    const guildsMap = await getBulkUserGuilds(userIds);

    res.status(200).json({
      data: result.data.map((user) => {
        // Generate QR code as base64
        const qrCode = Buffer.from(`USER:${user.id}:${user.studentId}`).toString('base64');
        
        // Format memberSince as ISO 8601
        const memberSince = user.created_at instanceof Date 
          ? user.created_at.toISOString() 
          : new Date(user.created_at).toISOString();
        
        return {
          id: String(user.id),
          email: user.email,
          fullName: user.fullName,
          studentId: user.studentId,
          yearLevel: user.yearLevel,
          course: user.course,
          role: user.role,
          requiresPasswordChange: user.requiresPasswordChange,
          qrCode: qrCode,
          memberSince: memberSince,
          guilds: guildsMap[user.id] || []
        };
      }),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to list members',
      },
    });
  }
}

/**
 * Admin: Update user role
 * Triggers automatic SharePoint sync
 */
async function updateUserRole(req, res) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['member', 'officer', 'admin'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: `Role must be one of: ${validRoles.join(', ')}`,
        },
      });
    }

    // Find user
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    // Update role
    const updatedUser = await updateUser(userId, { role });

    res.status(200).json({
      user: {
        id: String(updatedUser.id),
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        studentId: updatedUser.studentId,
        role: updatedUser.role,
      },
      message: `User role updated to '${role}'`,
      success: true,
    });

    // Auto-sync role change to SharePoint (fire-and-forget)
    syncInBackground(userId, { fields: ['Role'] });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update user role',
      },
    });
  }
}

/**
 * Admin: Deactivate user
 * Triggers automatic SharePoint sync
 */
async function deactivateUser(req, res) {
  try {
    const { userId } = req.params;

    // Find user
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    // Mark as inactive (add isActive field or similar)
    const updatedUser = await updateUser(userId, { isActive: false });

    res.status(200).json({
      user: {
        id: String(updatedUser.id),
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        studentId: updatedUser.studentId,
      },
      message: 'User deactivated successfully',
      success: true,
    });

    // Auto-sync deactivation to SharePoint — explicitly sets IsActive = false (fire-and-forget)
    syncInBackground(userId, { isActive: false });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to deactivate user',
      },
    });
  }
}

// Upload profile photo
async function uploadProfilePhoto(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: {
          code: 'NO_FILE',
          message: 'No file uploaded',
        },
      });
    }

    // Save the file path to database
    const photoPath = `/uploads/profile-photos/${req.file.filename}`;
    const updatedUser = await updateUser(req.user.id, {
      profilePhoto: photoPath,
    });

    res.status(200).json({
      profilePhoto: updatedUser.profilePhoto,
      message: 'Profile photo uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: {
        code: 'UPLOAD_ERROR',
        message: 'Failed to upload profile photo',
      },
    });
  }
}

// Get available avatar presets
async function getAvatarPresets(req, res) {
  try {
    res.status(200).json({
      avatars: AVATAR_PRESETS,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch avatars',
      },
    });
  }
}

// Select avatar preset
async function selectAvatar(req, res) {
  try {
    const { avatarId } = req.body;

    if (!avatarId) {
      return res.status(400).json({
        error: {
          code: 'INVALID_AVATAR',
          message: 'Avatar ID is required',
        },
      });
    }

    // Verify avatar exists
    const avatar = AVATAR_PRESETS.find(a => a.id === avatarId);
    if (!avatar) {
      return res.status(404).json({
        error: {
          code: 'AVATAR_NOT_FOUND',
          message: 'Avatar not found',
        },
      });
    }

    const updatedUser = await updateUser(req.user.id, {
      profilePhoto: avatar.path,
    });

    // Generate QR code as base64
    const qrCode = Buffer.from(`USER:${updatedUser.id}:${updatedUser.studentId}`).toString('base64');
    
    // Format memberSince as ISO 8601
    const memberSince = updatedUser.created_at instanceof Date 
      ? updatedUser.created_at.toISOString() 
      : new Date(updatedUser.created_at).toISOString();

    const userGuilds = await getUserGuilds(req.user.id);

    res.status(200).json({
      user: {
        id: String(updatedUser.id),
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        studentId: updatedUser.studentId,
        yearLevel: updatedUser.yearLevel,
        course: updatedUser.course,
        role: updatedUser.role,
        qrCode: qrCode,
        memberSince: memberSince,
        profilePhoto: updatedUser.profilePhoto || null,
        emergencyContact: updatedUser.emergencyContact || null,
        contactNumber: updatedUser.contactNumber || null,
        guilds: userGuilds.map(g => ({ id: String(g.id), name: g.name, slug: g.slug }))
      }
    });
  } catch (error) {
    console.error('Avatar selection error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to select avatar',
      },
    });
  }
}

module.exports = {
  getMe,
  updateMe,
  uploadProfilePhoto,
  getAvatarPresets,
  selectAvatar,
  listAllMembers,
  updateUserRole,           // NEW
  deactivateUser,           // NEW
};
