"use strict";

const express = require("express");
const uploadController = require("../../controllers/UploadController");
const { handlerError } = require("../../helpers/common");
const router = express.Router();
const { authentication } = require("../../auth/authUtils");
const { uploadDisk, uploadMemory } = require("../../configs/multer.config");

// authentication //
// router.use(authentication)

// upload image
router.post("/product", handlerError(uploadController.uploadImageFromUrl));
router.post(
  "/product/thumb",
  uploadDisk.single("file"),
  handlerError(uploadController.uploadImageFromLocal)
);
router.post(
  "/product/multiple/thumb",
  uploadDisk.array("files", 5),
  handlerError(uploadController.uploadMultipleImage)
);
// upload s3
router.post(
  "/product/s3-bucket",
  uploadMemory.single("file"),
  handlerError(uploadController.uploadImageS3Controller)
);

module.exports = router;
