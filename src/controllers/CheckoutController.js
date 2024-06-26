"use strict";

const { SuccessResponse } = require("../core/successResponse");
const CheckoutService = require("../services/CheckoutService");

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      message: "Checkout review success",
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };
}

module.exports = new CheckoutController();
