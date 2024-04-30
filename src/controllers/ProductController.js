"use strict";

const ProductService = require("../services/ProductService-V2");
const { SuccessResponse } = require("../core/successResponse");
class ProductController {
  /**
   * Create Product Controller
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create New Product Success!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * publish Product By Shop
   * @param {import("mongoose").ObjectId} product_shop 
   * @param {import("mongoose").ObjectId} product_id 
   * @return {JSON}
   */
  publishProductByShop = async (req, res, next) => {
    console.log(req.params.id);
    new SuccessResponse({
      message: "Publish Product By Shop Success!",
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * unPublish Product By Shop
   * @param {import("mongoose").ObjectId} product_shop 
   * @param {import("mongoose").ObjectId} product_id 
   * @return {JSON}
   */
  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "UnPublish Product By Shop Success!",
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get all product draft for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get List Product Draft Success!",
      metadata: await ProductService.findAllDraftForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get all product publish for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get List Product Publish Success!",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * getListSearchProduct
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get List Product Success!",
      metadata: await ProductService.searchProducts(req.params),
    }).send(res);
  };

  getAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get All Products Success!",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  getDetailProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Detail Product Success!",
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
