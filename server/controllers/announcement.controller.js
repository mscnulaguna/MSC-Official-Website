// Import announcement database functions
const {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
} = require('../models/announcement.model');
const { getGuildById } = require('../models/guild.model');

// Get paginated list of announcements with optional filters
async function listAnnouncements(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize) || 20, 100);
    const filters = {
      pinned: req.query.pinned === 'true',
    };

    const result = await getAllAnnouncements(page, pageSize, filters);

    res.status(200).json({
      data: result.data.map(announcement => ({
        id: String(announcement.id),
        title: announcement.title,
        body: announcement.content,
        pinned: Boolean(announcement.pinned),
        guildId: announcement.guild_id ? String(announcement.guild_id) : null,
        createdAt: announcement.created_at,
        createdBy: announcement.created_by,
        createdByName: announcement.createdByName,
        imageUrl: announcement.image_url
      })),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch announcements',
      },
    });
  }
}

async function createNewAnnouncement(req, res) {
  try {
    const { title, body, pinned, guildId, imageUrl } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title and body are required',
        },
      });
    }

    // Validate guildId exists if provided
    if (guildId) {
      const guild = await getGuildById(guildId);
      if (!guild) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Guild not found',
          },
        });
      }
    }

    const announcement = await createAnnouncement({
      title,
      content: body,
      image_url: imageUrl || null,
      pinned: pinned || false,
      guild_id: guildId || null,
      created_by: req.user.id,
    });

    res.status(201).json({
      announcement: {
        id: String(announcement.id),
        title: announcement.title,
        body: announcement.content,
        pinned: Boolean(announcement.pinned),
        guildId: announcement.guild_id ? String(announcement.guild_id) : null,
        guildName: announcement.guildName || null,
        imageUrl: announcement.image_url || null,
        createdAt: announcement.created_at,
        createdBy: String(announcement.created_by),
        createdByName: announcement.createdByName || null,
      }
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create announcement',
      },
    });
  }
}

module.exports = {
  listAnnouncements,
  createNewAnnouncement,
};
