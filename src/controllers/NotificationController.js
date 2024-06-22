"use strict";

const { getListNotificationByUser } = require("../services/NotificationService");
const { SuccessResponse } = require("../core/successResponse");
class NotificationController {
  /**
   * Get list notification
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  getListNotificationByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Get List Notification By User Success!",
      metadata: await getListNotificationByUser(req.query),
    }).send(res);
  };
}

module.exports = new NotificationController();
