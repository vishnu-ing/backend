// housing routes
const express = require('express');
const router = express.Router();
const {
  getAllHousing,
  getMyHousing,
  getHousingById,
  createHousing,
  deleteHousing,
} = require('../controllers/housingController');
const auth = require('../middlewares/auth');
// route to delete a house by ID (protected)
router.delete('/:id', auth, deleteHousing);
// route to create a new house
router.post('/', createHousing);
// route to get all housing info
router.get('/', getAllHousing);

// route to get housing info for logged-in user (protected)
router.get('/me', auth, getMyHousing);

// route to get housing info by house ID (protected)
router.get('/:id', auth, getHousingById);

module.exports = router;
