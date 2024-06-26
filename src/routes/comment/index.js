"use strict";

const express = require("express");
const commentController = require("../../controllers/CommentController");
const { handlerError } = require("../../helpers/common");
const router = express.Router();

// add comment
router.post("", handlerError(commentController.createComment));
router.get("", handlerError(commentController.getCommentsByParentId));
router.delete("", handlerError(commentController.deleteComment));

module.exports = router;
