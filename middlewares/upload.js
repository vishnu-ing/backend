const multer = require('multer');
const path = require('path');

// configuration for file upload to be compatible with material UI, it is storing into the uploads folder for now until our AWS server gets setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists in your project root
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage: storage });
module.exports = upload;