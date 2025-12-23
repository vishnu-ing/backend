const s3 = require('../config/aws');

// const uploadFile = (buffer, key, contentType) => {
//   const params = {
//     Bucket: process.env.AWS_S3_BUCKET,
//     Key: key,
//     Body: buffer,
//     ContentType: contentType,
    
//   };

//   return new Promise((resolve, reject) => {
//     s3.upload(params, (err, data) => {
//       if (err) return reject(err);
//       resolve(data);
//     });
//   });
// };
const uploadFile = async (buffer, key, contentType) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  };

  await s3.putObject(params).promise();
  console.log("url: ", `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,)
  return {
    Location: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    Key: key,
  };
};


const getPresignedUrl = (key, expires = 900) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Expires: expires,
  };

  return s3.getSignedUrl('getObject', params);
};

const deleteFile = (key) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  };

  return s3.deleteObject(params).promise();
};

module.exports = {
  uploadFile,
  getPresignedUrl,
  deleteFile,
};
