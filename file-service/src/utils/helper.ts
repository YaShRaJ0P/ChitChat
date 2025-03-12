const AWS = require("aws-sdk");
import config from "./config";

const s3 = new AWS.S3({
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  region: config.AWS_REGION,
});

const uploadFileToS3 = async (file, userId) => {
  const fileKey = `uploads/${userId}/${Date.now()}-${file.originalname}`;

  const params = {
    Bucket: config.AWS_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location; // Return the file URL
};

module.exports = { uploadFileToS3 };
