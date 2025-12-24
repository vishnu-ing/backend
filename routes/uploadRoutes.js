const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { uploadProfilePicture, uploadDriverLicense, uploadVisaDocument } = require('../controllers/uploadController');
const upload = require('../middlewares/upload');

// POST /api/upload/profile-picture
router.post(
  '/profile-picture',
  auth,
  upload.uploadSingle('file'),
  uploadProfilePicture
);

// POST /api/upload/driver-license
router.post(
  '/driver-license',
  auth,
  upload.uploadSingle('file'),
  uploadDriverLicense
);
// POST /api/upload/visa-documents
router.post(
  '/visa-documents',
  auth,
  upload.uploadSingle('file'),
  uploadVisaDocument
);

module.exports = router;
