// Import guild and user database functions
const { syncInBackground } = require('../services/sharepoint.service');
const {
  getAllGuilds,
  getPaginatedGuilds,
  getGuildCount,
  getGuildBySlug,
  getGuildMembers,
  isGuildMember,
  getGuildResources,
  getPaginatedGuildResources, // added pagination parameters to function signature | check guild.model.js for implementation
  getGuildResourceCount,
  getGuildApplication,
  createGuildApplication,
  addGuildMember,
} = require('../models/guild.model');
const { findUserById } = require('../models/user.model');

// Get paginated list of all guilds
async function listGuilds(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 100);
    const offset = (page - 1) * pageSize;

    const [guilds, total] = await Promise.all([
      getPaginatedGuilds(pageSize, offset),
      getGuildCount(),
    ]);

    res.status(200).json({
      data: guilds.map((guild) => ({
        id: String(guild.id),
        name: guild.name,
        slug: guild.slug,
        description: guild.description,
        image_url: guild.image_url,
        memberCount: guild.memberCount,
        leaderName: guild.leaderName,
      })),
      total: total,
      page: page,
      pageSize: pageSize,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch guilds',
      },
    });
  }
}

async function getGuild(req, res) {
  try {
    const { slug } = req.params;
    console.log('Fetching guild with slug:', slug);

    const guild = await getGuildBySlug(slug);
    console.log('Guild found:', guild);

    if (!guild) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Guild not found',
        },
      });
    }

    const members = await getGuildMembers(guild.id);
    const resources = await getGuildResources(guild.id);

    // Parse roadmap if it's a JSON string
    let roadmap = [];
    if (guild.roadmap) {
      try {
        const parsedRoadmap = typeof guild.roadmap === 'string' ? JSON.parse(guild.roadmap) : guild.roadmap;
        // Handle both string arrays and object arrays
        if (Array.isArray(parsedRoadmap)) {
          roadmap = parsedRoadmap.map((item) => {
            if (typeof item === 'string') {
              return { title: item, description: '' };
            }
            return item;
          });
        }
      } catch (e) {
        console.error('Error parsing roadmap:', e);
      }
    }

    // Map leads using guild-specific role (guildRole), not system role
    const leads = members
      .filter((m) => ['officer', 'admin'].includes(m.guildRole))
      .map((m) => ({
        id: String(m.user_id),
        fullName: m.fullName,
        email: m.email,
        role: m.guildRole,
      }));

    // Map resources to spec shape with safe tag parsing
    const mappedResources = resources.map((r) => {
      let tags = [];

      if (r.tags) {
        if (typeof r.tags === 'string') {
          try {
            tags = JSON.parse(r.tags);
          } catch (e) {
            tags = [];
          }
        } else {
          tags = r.tags;
        }
      }

      return {
        id: String(r.id),
        title: r.title,
        type: r.type,
        url: r.url,
        level: r.level,
        tags: tags,
      };
    });

    res.status(200).json({
      id: String(guild.id),
      name: guild.name,
      slug: slug,
      description: guild.description,
      image_url: guild.image_url,
      memberCount: guild.memberCount,
      leads: leads,
      roadmap: roadmap,
      resources: mappedResources,
    });
  } catch (error) {
    console.error('Guild fetch error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch guild',
      },
    });
  }
}

async function getGuildResourcesHandler(req, res) {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const offset = (page - 1) * limit;
    
    const filters = {
      level: req.query.level,
      type: req.query.type,
    };

    const guild = await getGuildBySlug(slug);

    if (!guild) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Guild not found',
        },
      });
    }

    // Check if user is a guild member or officer/admin
    if (req.user) {
      const isMember = await isGuildMember(guild.id, req.user.id);
      const isOfficer = req.user.role === 'officer' || req.user.role === 'admin';

      if (!isMember && !isOfficer) {
        return res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'Must be a guild member to access resources',
          },
        });
      }
    } else {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    const [resources, total] = await Promise.all([
      getPaginatedGuildResources(guild.id, filters, limit, offset),
      getGuildResourceCount(guild.id, filters),
    ]);

    res.status(200).json({
      data: resources.map((r) => {
        let tags = [];

        if (r.tags) {
          if (typeof r.tags === 'string') {
            try {
              tags = JSON.parse(r.tags);
            } catch (e) {
              tags = [];
            }
          } else {
            tags = r.tags;
          }
        }

        return {
          id: String(r.id),
          title: r.title,
          type: r.type,
          url: r.url,
          level: r.level,
          tags: tags,
        };
      }),
      total: total,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch guild resources',
      },
    });
  }
}

async function applyToGuild(req, res) {
  try {
    const { slug } = req.params;
    const { motivation, experience, portfolioUrl } = req.body;
    const userId = req.user.id;

    if (!motivation || motivation.length < 50) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Motivation must be at least 50 characters',
        },
      });
    }

    const guild = await getGuildBySlug(slug);

    if (!guild) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Guild not found',
        },
      });
    }

    // Check if user has already applied
    const existingApplication = await getGuildApplication(guild.id, userId);

    if (existingApplication) {
      return res.status(409).json({
        error: {
          code: 'ALREADY_APPLIED',
          message: 'You have already applied to this guild',
        },
      });
    }

    // Create application in database
    const applicationId = await createGuildApplication(
      guild.id,
      userId,
      motivation,
      experience || null,
      portfolioUrl || null
    );

    res.status(201).json({
      applicationId: applicationId,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      message: 'Application submitted successfully',
    });
  } catch (error) {
    console.error('Apply to guild error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to apply to guild',
      },
    });
  }
}

/**
 * Admin: Approve user's guild application
 * Triggers automatic SharePoint sync to update guilds field
 */
async function approveGuildApplication(req, res) {
  try {
    const { userId } = req.params;
    const { guildId } = req.body;

    if (!guildId) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'guildId is required in the request body' },
      });
    }

    // Find user
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
    }

    // Add to guild_members and mark application approved
    await addGuildMember(guildId, userId);

    res.status(200).json({
      success: true,
      message: `Guild application approved for ${user.fullName}`,
      userId: String(user.id),
      guildId: String(guildId),
    });

    // Auto-sync updated guild membership to SharePoint (fire-and-forget)
    syncInBackground(userId, { fields: ['Guilds'] });
  } catch (error) {
    console.error('Approve guild application error:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to approve guild application' },
    });
  }
}

module.exports = {
  listGuilds,
  getGuild,
  getGuildResourcesHandler,
  applyToGuild,
  approveGuildApplication,  // NEW
};
