"use strict";

const UploadService = require("../services/UploadService");
const { SuccessResponse } = require("../core/successResponse");
const { BadRequestError } = require("../core/errorResponse");
class UploadController {
  /**
   * Upload Image From Url Controller
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  uploadImageFromUrl = async (req, res, next) => {
    new SuccessResponse({
      message: "Upload Image From Url Success!",
      metadata: await UploadService.uploadImageFromUrl({
        ...req.body,
      }),
    }).send(res);
  };

  /**
   * Upload Image From Local Controller
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  uploadImageFromLocal = async (req, res, next) => {
    const { file } = req;
    console.log({ file });
    if (!file) throw new BadRequestError("File missing");
    new SuccessResponse({
      message: "Upload Image From Local Success!",
      metadata: await UploadService.uploadImageFromLocal({
        path: file.path,
      }),
    }).send(res);
  };

  /**
   * Upload Multiple Image
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  uploadMultipleImage = async (req, res, next) => {
    const filePaths = req.files.map((file) => file.path);
    if (!filePaths) throw new BadRequestError("File missing");
    new SuccessResponse({
      message: "Upload Multiple Image Success!",
      metadata: await UploadService.uploadMultipleImage({
        paths: filePaths,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
