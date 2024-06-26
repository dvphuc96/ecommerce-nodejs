"use strict";

const { SuccessResponse } = require("../core/successResponse");
const DiscountService = require("../services/DiscountService");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Create discount success",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodes = async (req, res, next) => {
    console.log(req.user.userId);
    new SuccessResponse({
      message: "Get all discount code success",
      metadata: await DiscountService.getAllDiscountCodes({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodeWithProducts = async (req, res, next) => {
    console.log("req", req);
    new SuccessResponse({
      message: "Get all discount code with product success",
      metadata: await DiscountService.getAllDiscountCodeWithProducts({
        ...req.query,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Get discount amount success",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();