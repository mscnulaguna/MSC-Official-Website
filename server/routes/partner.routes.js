// Import Express and partner controller functions
const express = require('express');
const { listPartners, createNewPartner, updatePartner, deletePartner } = require('../controllers/partner.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// Create router instance
const router = express.Router();

// Public read partners
router.get('/', listPartners);

// Create partners (admins only)
router.post('/', authMiddleware, roleMiddleware(['admin']), createNewPartner);

// Update partners (admins only)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updatePartner);

// Delete partners (admins only) - not implemented yet
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deletePartner);

// Export partner router
module.exports = router;
