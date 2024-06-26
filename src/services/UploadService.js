"use strict";

const cloudinary = require("../configs/cloudinary.config");
const { convertToObjectId } = require("../utils");
const {
  s3,
  PutObjectCommand,
  GetObjectCommand,
} = require("../configs/s3.config");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer"); // CJS
const crypto = require("crypto");
const randomImageName = () => crypto.randomBytes(16).toString("hex");
const urlImagePublic = process.env.AWS_BUCKET_URL_IMAGE_PUBLIC;
// Constants
const DEFAULT_FOLDER_NAME = "product/8409";
const DEFAULT_IMAGE_PREFIX = "image_";
const DEFAULT_THUMB_PREFIX = "thumb_";
const THUMB_WIDTH = 100;
const THUMB_HEIGHT = 100;
const THUMB_CROP = "fill";
const THUMB_GRAVITY = "auto";
const THUMB_FORMAT = "jpg";

/////////////// Upload file use S3Client ///////////////
// 3.upload Image From Local
const uploadImageToS3Service = async ({ file }) => {
  try {
    const imageName = randomImageName();
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
      Body: file.buffer,
      ContentType: "image/jpeg",
    });

    // export url s3
    const result = await s3.send(command);
    // const signedUrl = new GetObjectCommand({
    //   Bucket: process.env.AWS_BUCKET_NAME,
    //   Key: imageName,
    // });
    // const urlS3 = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 });
    const signedUrl = getSignedUrl({
      url: `${urlImagePublic}/${imageName}`,
      keyPairId: process.env.AWS_BUCKET_PUBLIC_KEY_ID,
      dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24), // expire after 1d
      privateKey: process.env.AWS_BUCKET_PRIVATE_KEY_ID,
    });
    return {
      signedUrl,
      result,
    };
  } catch (error) {
    console.error("Error uploading image use s3Client::", error);
  }
};

/////////////// End s3 Service ///////////////

// Helper function to upload a file to Cloudinary
const uploadFileToCloudinary = async ({
  path,
  folderName = "product/8409",
}) => {
  const result = await cloudinary.uploader.upload(path, {
    public_id: `${DEFAULT_THUMB_PREFIX}${Date.now()}`,
    folder: folderName,
  });
  return {
    image_url: result.secure_url,
    shopId: 8409,
    thumb_url: cloudinary.url(result.public_id, {
      width: THUMB_WIDTH,
      height: THUMB_HEIGHT,
      crop: THUMB_CROP,
      gravity: THUMB_GRAVITY,
      format: THUMB_FORMAT,
    }),
  };
};

// 1.upload from url image
const uploadImageFromUrl = async (payload) => {
  const { shopId, urlImage } = payload;
  try {
    const folderName = `product/${convertToObjectId(shopId)}`; // get shopId từ body.
    const result = await cloudinary.uploader.upload(urlImage, {
      public_id: `${DEFAULT_IMAGE_PREFIX}${Date.now()}`,
      folder: folderName,
    });
    return result;
  } catch (error) {
    console.error("Error uploading image::", error);
  }
};

// 2.upload from file image local
// use multer
// Note: cái này bắt buộc login mới lấy dc shopId

const uploadImageFromLocal = async ({ path }) => {
  try {
    return await uploadFileToCloudinary({ path });
  } catch (error) {
    console.error("Error uploading image::", error);
  }
};

// 3. upload multiple image from local
const uploadMultipleImage = async ({ paths }) => {
  // paths là một mảng chứa các đường dẫn tới các file cần upload
  try {
    const uploadPromises = paths.map((path) =>
      uploadFileToCloudinary({ path })
    );
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("Error uploading images::", error);
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadMultipleImage,
  uploadImageToS3Service,
};
