"use strict";

const CommentService = require("../services/CommentService");
const { SuccessResponse } = require("../core/successResponse");
class CommentController {

  /**
   * Add to cart for user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   *
   */
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: "Create New Comment Success!",
      metadata: await CommentService.createComment(req.body),
    }).send(res);
  };

  /**
   * Get list cart for user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  getCommentsByParentId = async (req, res, next) => {
    new SuccessResponse({
      message: "Get List Comment by parentId Success!",
      metadata: await CommentService.getCommentsByParentId(req.query),
    }).send(res);
  };

  /**
   * Delete comments
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  deleteComment = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete Comments Success!",
      metadata: await CommentService.deleteComment(req.body),
    }).send(res);
  };
}

module.exports = new CommentController();
