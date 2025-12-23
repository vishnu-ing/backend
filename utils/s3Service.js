const s3 = require('../config/aws');

const uploadFile = (buffer, key, contentType) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

const getPresignedUrl = (key, expires = 900) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Expires: expires,
  };

  return s3.getSignedUrl('getObject', params);
};

const deleteFile = (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  };

  return s3.deleteObject(params).promise();
};

module.exports = {
  uploadFile,
  getPresignedUrl,
  deleteFile,
};
