"use strict";

const express = require("express");
const notificationController = require("../../controllers/NotificationController");
const { handlerError } = require("../../helpers/common");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();
// get list notification for user not login

// authentication //
router.use(authentication);
// get list notification for user login
router.get("", handlerError(notificationController.getListNotificationByUser));

module.exports = router;
