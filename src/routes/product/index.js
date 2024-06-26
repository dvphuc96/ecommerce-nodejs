"use strict";

const express = require("express");
const productController = require("../../controllers/ProductController");
const { handlerError } = require("../../helpers/common");
const router = express.Router();
const {authentication} = require("../../auth/authUtils");

// not authentication
router.get("/search/:keySearch", handlerError(productController.getListSearchProduct));
router.get("", handlerError(productController.getAllProducts));
router.get("/:product_id", handlerError(productController.getDetailProduct));

// authentication //
router.use(authentication)

// create product
router.post("", handlerError(productController.createProduct));

// update
router.patch("/:productId", handlerError(productController.updateProduct));

// Update product publish
router.post("/publish/:id", handlerError(productController.publishProductByShop));
router.post("/unpublish/:id", handlerError(productController.unPublishProductByShop));
// query
router.get("/drafts/all", handlerError(productController.getAllDraftsForShop));
router.get("/published/all", handlerError(productController.getAllPublishForShop));
module.exports = router;
