// Import JWT, QR code, and event database functions
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const { findUserById } = require('../models/user.model');
const { sendRegistrationConfirmationSafe } = require('../services/email.service');
const {
  getAllEvents,
  getEventById,
  createEvent,
  isUserRegistered,
  registerUserForEvent,
  markAttendance,
  getEventAttendance,
  getEventCapacity,
} = require('../models/event.model');

// JWT secret for signing QR code payloads
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured');
}

// Get paginated list of events with filtering
async function getAllEventsHandler(req, res) {
  console.log('[getAllEvents] req.user:', req.user)
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize) || 50, 50);
    const filters = {
      status: req.query.status || 'all',
      guild: req.query.guild,
      type: req.query.type,
    };

    const userId = req.user?.id  // may be null if unauthenticated

    const result = await getAllEvents(page, pageSize, filters);

    // Check registration status for all events in parallel (only if authenticated)
    const registrationChecks = userId
      ? await Promise.all(result.data.map(event => isUserRegistered(event.id, userId)))
      : result.data.map(() => false)

    const mappedData = result.data.map((event, index) => {
      let speakers = event.speakers;
      let agenda = event.agenda;

      if (speakers && typeof speakers === 'string') {
        try { speakers = JSON.parse(speakers) } catch { speakers = [] }
      }
      if (agenda && typeof agenda === 'string') {
        try { agenda = JSON.parse(agenda) } catch { agenda = [] }
      }

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.start_date,
        endDate: event.end_date,
        venue: event.location,
        capacity: event.max_capacity,
        registered: event.registeredCount || 0,
        guild: event.guild_id ? { id: event.guild_id, name: event.guildName, slug: event.guildSlug } : null,
        speakers,
        agenda,
        coverImage: event.coverImage,
        type: event.type,
        userRegistered: registrationChecks[index],
      };
    });

    res.status(200).json({
      data: mappedData,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch events' } });
  }
}

// ===== GET SINGLE EVENT =====

async function getEventByIdHandler(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!id) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Event ID is required',
        },
      });
    }

    const event = await getEventById(id);

    if (!event) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Event not found',
        },
      });
    }

    // Check if user is already registered (only if authenticated)
    let userRegistered = false;
    if (userId) {
      userRegistered = await isUserRegistered(id, userId);
    }

    // Parse JSON fields
    if (event.agenda) {
      event.agenda = typeof event.agenda === 'string' ? JSON.parse(event.agenda) : event.agenda;
    }
    if (event.speakers) {
      event.speakers = typeof event.speakers === 'string' ? JSON.parse(event.speakers) : event.speakers;
    }

    // Map database fields to contract field names
    const mappedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.start_date,
      endDate: event.end_date,
      venue: event.location,
      capacity: event.max_capacity,
      registered: event.registeredCount || 0,
      guild: event.guild_id ? { id: event.guild_id, name: event.guildName, slug: event.guildSlug } : null,
      speakers: event.speakers,
      agenda: event.agenda,
      coverImage: event.coverImage,
      registrationOpen: event.end_date
        ? new Date(event.end_date) > new Date() && (!event.max_capacity || (event.registeredCount || 0) < event.max_capacity)
        : true,
      type: event.type,
      userRegistered: userRegistered,
    };

    res.status(200).json(mappedEvent);
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch event',
      },
    });
  }
}

// ===== CREATE EVENT =====

async function createNewEvent(req, res) {
  try {
    const {
      guildId,
      title,
      description,
      coverImage,
      date,
      endDate,
      venue,
      capacity,
      type,
      agenda,
      speakers,
    } = req.body;

    if (!title || !description || !date || !endDate || !venue || !capacity || !type) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Required fields: title, description, date, endDate, venue, capacity, type',
        },
      });
    }

    // Ensure created_by is set from authenticated user
    const createdBy = req.user?.id;
    if (!createdBy) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'User authentication failed',
        },
      });
    }

    const eventData = {
      guild_id: guildId || null,
      title,
      description,
      coverImage: coverImage || null,
      start_date: date,
      end_date: endDate,
      location: venue,
      max_capacity: capacity,
      type,
      agenda: agenda || null,
      speakers: speakers || null,
      created_by: createdBy,
    };

    const newEvent = await createEvent(eventData);

    // Parse JSON fields on the returned event
    const parsedSpeakers = newEvent.speakers
      ? (typeof newEvent.speakers === 'string' ? JSON.parse(newEvent.speakers) : newEvent.speakers)
      : [];
    const parsedAgenda = newEvent.agenda
      ? (typeof newEvent.agenda === 'string' ? JSON.parse(newEvent.agenda) : newEvent.agenda)
      : [];

    // Map response to full event contract
    const mappedEvent = {
      id: newEvent.id,
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.start_date,
      endDate: newEvent.end_date,
      venue: newEvent.location,
      capacity: newEvent.max_capacity,
      registered: newEvent.registeredCount || 0,
      guild: newEvent.guild_id ? { id: newEvent.guild_id, name: newEvent.guildName, slug: newEvent.guildSlug } : null,
      speakers: parsedSpeakers,
      agenda: parsedAgenda,
      coverImage: newEvent.coverImage,
      type: newEvent.type,
      registrationOpen: true,
    };

    res.status(201).json({
      event: mappedEvent,
    });
  } catch (error) {
    console.error('[CREATE_EVENT] Error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create event',
      },
    });
  }
}

// ===== REGISTER FOR EVENT =====

async function registerForEvent(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Event ID is required',
        },
      });
    }

    // Check if event exists
    const event = await getEventById(id);
    if (!event) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Event not found',
        },
      });
    }

    // Check if capacity is full
    const capacity = await getEventCapacity(id);
    if (capacity && capacity.isFull) {
      return res.status(422).json({
        error: {
          code: 'CAPACITY_FULL',
          message: 'Event registration is at capacity',
        },
      });
    }

    // Check if user is already registered
    const alreadyRegistered = await isUserRegistered(id, userId);
    if (alreadyRegistered) {
      return res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'User is already registered for this event',
        },
      });
    }

    // Generate confirmation code
    const confirmationCode = Math.random().toString(36).substr(2, 9).toUpperCase();

    // Generate JWT payload for QR code
    const qrPayload = {
      userId,
      eventId: parseInt(id),
      confirmationCode,
      iat: Math.floor(Date.now() / 1000),
    };

    const signedToken = jwt.sign(qrPayload, JWT_SECRET, { expiresIn: '30d' });

    // Generate QR code as data URI
    let qrCodeDataUri;
    try {
      qrCodeDataUri = await QRCode.toDataURL(signedToken, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.95,
        margin: 1,
        width: 300,
      });
    } catch (qrError) {
      qrCodeDataUri = null;
    }

    // Save registration to database
    const registration = await registerUserForEvent(id, userId, confirmationCode, signedToken);

    res.status(200).json({
      registrationId: registration.id,
      confirmationCode,
      qrCode: qrCodeDataUri,
      eventId: parseInt(id),
      userId,
    });

    // Send confirmation email with QR code attachment (fire-and-forget — never blocks response)
    const user = await findUserById(userId);
    if (user) {
      sendRegistrationConfirmationSafe(
        user,
        event,
        { ...registration, qrCodeDataUri }
      );
    }
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to register for event',
      },
    });
  }
}

// ===== MARK ATTENDANCE =====

async function markAttendanceHandler(req, res) {
  try {
    const { id } = req.params;
    const { qrCode, userId } = req.body;

    if (!qrCode && !userId) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'QR code or user ID is required',
        },
      });
    }

    // Check if event exists
    const event = await getEventById(id);
    if (!event) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Event not found',
        },
      });
    }

    let attendeeUserId;

    // If QR code is provided, verify the JWT
    if (qrCode) {
      try {
        const decoded = jwt.verify(qrCode, JWT_SECRET);
        attendeeUserId = decoded.userId;

        // Verify the eventId in the token matches the route
        if (decoded.eventId !== parseInt(id)) {
          return res.status(400).json({
            error: {
              code: 'VALIDATION_ERROR',
              message: 'QR code does not match this event',
            },
          });
        }
      } catch (jwtError) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid or expired QR code',
          },
        });
      }
    } else {
      attendeeUserId = userId;
    }

    // Mark attendance
    const attendance = await markAttendance(id, attendeeUserId);

    if (!attendance) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Registration not found for this user and event',
        },
      });
    }

    res.status(200).json({
      attended: true,
      userId: attendance.user_id,
      userName: attendance.fullName,
      timestamp: attendance.updated_at,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to mark attendance',
      },
    });
  }
}

// ===== GET ATTENDANCE LIST =====

async function getAttendanceHandler(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Event ID is required',
        },
      });
    }

    // Check if event exists
    const event = await getEventById(id);
    if (!event) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Event not found',
        },
      });
    }

    const { attendees, stats } = await getEventAttendance(id);

    res.status(200).json({
      data: attendees,
      count: stats.attendanceCount,
      registrationCount: stats.registrationCount,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch attendance',
      },
    });
  }
}

// Upload event cover image
async function uploadEventCoverImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'No image file provided',
        },
      });
    }

    const imageUrl = `/event-covers/${req.file.filename}`;

    res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      message: 'Event cover image uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading event cover image:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to upload image',
      },
    });
  }
}
async function updateEventHandler(req, res) {
  try {
    const { id } = req.params;
    const eventData = req.body;
    
    // This is where you call the function from your MODEL
    const updatedEvent = await updateEvent(id, eventData); 

    if (!updatedEvent) {
      return res.status(404).json({ error: { message: 'Event not found' } });
    }

    res.status(200).json({ event: updatedEvent });
  } catch (error) {
    res.status(500).json({ error: { message: 'Update failed' } });
  }
}

module.exports = {
  getAllEventsHandler,
  getEventByIdHandler,
  createNewEvent,
  updateEventHandler,
  registerForEvent,
  markAttendanceHandler,
  getAttendanceHandler,
  uploadEventCoverImage,
};
