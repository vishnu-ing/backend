const { uploadFile, getPresignedUrl } = require('../utils/s3Service');
const path = require('path');

exports.uploadProfilePicture = async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const file = req.file;
    const ext = path.extname(file.originalname).toLowerCase();
    const key = `profiles/${req.user.userId}/profile-picture${ext}`;

    const data = await uploadFile(file.buffer, key, file.mimetype);

    // data.Location contains the uploaded file URL
    res.json({ url: data.Location, key: data.Key });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

exports.uploadDriverLicense = async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const file = req.file;
    const ext = path.extname(file.originalname).toLowerCase();
    const key = `profiles/${req.user.userId}/driver-license${ext}`;

    const data = await uploadFile(file.buffer, key, file.mimetype);

    // data.Location contains the uploaded file URL
    res.json({ url: data.Location, key: data.Key });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};


exports.uploadVisaDocument = async (req, res) => {
  try {
    if (!req.file || !req.body.visaDocId) {
      return res.status(400).json({ error: "Missing file or visaDocId" });
    }

    const file = req.file;
    const visaDocId = req.body.visaDocId;
    const ext = path.extname(file.originalname).toLowerCase();

    const key = `profiles/${req.user.userId}/visa-documents/${visaDocId}${ext}`;

    const data = await uploadFile(file.buffer, key, file.mimetype);

    res.json({
      url: data.Location,
      key: data.Key,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload visa document" });
  }
};

