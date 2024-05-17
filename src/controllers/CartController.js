"use strict";

const CartService = require("../services/CartService");
const { SuccessResponse } = require("../core/successResponse");
class CartController {
  /**
   * Add to cart for user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   *
   */
  addCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Create New Cart Success!",
      metadata: await CartService.addProductToCart(req.body),
    }).send(res);
  };

  /**
   * Update to cart for user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  updateCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Update Cart Success!",
      metadata: await CartService.updateProductToCart(req.body),
    }).send(res);
  };

  /**
   * Delete to cart for user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  deleteCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete Cart Success!",
      metadata: await CartService.deleteProductToCart(req.body),
    }).send(res);
  };

  /**
   * Get list cart for user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  getListCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Get List Cart Success!",
      metadata: await CartService.getListProductToCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
