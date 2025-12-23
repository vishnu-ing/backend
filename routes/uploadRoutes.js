const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { uploadProfilePicture, getProfilePictureUrl } = require('../controllers/uploadController');
const upload = require('../middlewares/upload');

// POST /api/upload/profile-picture
router.post(
  '/profile-picture',
  auth,
  upload.uploadSingle('file'),
  uploadProfilePicture
);


module.exports = router;
