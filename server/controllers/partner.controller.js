// Import partner database functions
const { getAllPartners, createPartner } = require('../models/partner.model');

// Get paginated list of partners
async function listPartners(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize) || 20, 100);

    const result = await getAllPartners(page, pageSize);

    res.status(200).json({
      data: result.data.map((partner) => ({
        id: String(partner.id),
        name: partner.name,
        logo: partner.logo_url,
        url: partner.website_url,
        bio: partner.description,
        tier: partner.tier || 'bronze',
      })),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch partners',
      },
    });
  }
}

// Create new partner
async function createNewPartner(req, res) {
  try {
    const { name, logo, url, bio, tier } = req.body;

    if (!name || !logo || !url || !bio || !tier) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name, logo, url, bio, and tier are required',
        },
      });
    }

    // Validate tier
    const validTiers = ['bronze', 'silver', 'gold', 'platinum'];
    if (!validTiers.includes(tier)) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Tier must be one of: bronze, silver, gold, platinum',
        },
      });
    }

    const partner = await createPartner({
      name,
      description: bio,
      logo_url: logo,
      website_url: url,
      tier,
      created_by: req.user.id,
    });

    res.status(201).json({
      partner: {
        id: String(partner.id),
        name: partner.name,
        logo: partner.logo_url,
        url: partner.website_url,
        bio: partner.description,
        tier: partner.tier || tier,
      },
    });
  } catch (error) {
    // MySQL duplicate entry on unique name column
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'A partner with that name already exists',
        },
      });
    }
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create partner',
      },
    });
  }
}

module.exports = {
  listPartners,
  createNewPartner,
};
