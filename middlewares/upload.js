const multer = require('multer');

const storage = multer.memoryStorage();

const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and images are allowed.'), false);
  }
};

// Limits: 10 MB default
const limits = {
  fileSize: 10 * 1024 * 1024,
};

const upload = multer({ storage, fileFilter, limits });

module.exports = {
  uploadSingle: (fieldName = 'file') => upload.single(fieldName),
  uploadArray: (fieldName = 'files', maxCount = 5) => upload.array(fieldName, maxCount),
  uploadFields: (fieldsConfig) => upload.fields(fieldsConfig),
};
