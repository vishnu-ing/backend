const express = require('express');
const router = express.Router();
const {
  getPersonalInfo,
  updatePersonalInfo,
  getAllEmployees,
} = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/user', auth, getPersonalInfo);
router.put('/user', auth, updatePersonalInfo);
router.get('/employees', getAllEmployees); // New route - no auth for testing

module.exports = router;
