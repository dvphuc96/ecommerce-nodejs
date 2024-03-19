"use strict";

const ProductService = require("../services/ProductService");
const { SuccessResponse } = require("../core/successResponse");
class ProductController {
  /**
   * Create Product Controller
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  createProduct = async (req, res, next) => {
    console.log(req.user)
    new SuccessResponse({
      message: "Create New Product Success!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
