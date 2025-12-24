const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const visaController = require('../controllers/visaController');

// GET /api/visa - list user's visa documents
router.get('/', auth, visaController.getUserVisaDocuments);

// POST /api/visa/upload - upload a visa document
router.post('/upload', auth, upload.uploadSingle('file'), visaController.uploadVisaDocument);

module.exports = router;

