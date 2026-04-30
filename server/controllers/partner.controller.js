// Import partner database functions
const { getAllPartners, createPartner, updatePartner: updatePartnerInDb, getPartnerById, deletePartner: deletePartnerFromDb } = require('../models/partner.model');

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
    const { name, logo, url, bio } = req.body;

    if (!name || !logo || !url || !bio ) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name, logo, url, and bio are required',
        },
      });
    }

    

    const partner = await createPartner({
      name,
      description: bio,
      logo_url: logo,
      website_url: url,
      created_by: req.user.id,
    });

    res.status(201).json({
      partner: {
        id: String(partner.id),
        name: partner.name,
        logo: partner.logo_url,
        url: partner.website_url,
        bio: partner.description,
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

// Update existing partner
async function updatePartner(req, res) {
  try {
    const { id } = req.params;
    const { name, logo, url, bio } = req.body;

    if (!name || !logo || !url || !bio) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name, logo, url, and bio are required',
        },
      });
    }

    const existing = await getPartnerById(id);
    if (!existing) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Partner not found',
        },
      });
    }

    const partner = await updatePartnerInDb(id, {
      name,
      description: bio,
      logo_url: logo,
      website_url: url,
    });

    res.status(200).json({
      partner: {
        id: String(partner.id),
        name: partner.name,
        logo: partner.logo_url,
        url: partner.website_url,
        bio: partner.description,
        tier: partner.tier || 'bronze',
      },
    });
  } catch (error) {
    console.error('Update partner error:', error);
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
        message: 'Failed to update partner',
      },
    });
  }
}

async function deletePartner(req, res) {
  try {
    const { id } = req.params;

    const existing = await getPartnerById(id);
    if (!existing) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Partner not found',
        },
      });
    }

    await deletePartnerFromDb(id);

    res.status(200).json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Delete partner error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete partner',
      },
    });
  }
}

module.exports = {
  listPartners,
  createNewPartner,
  updatePartner,
  deletePartner,
};
