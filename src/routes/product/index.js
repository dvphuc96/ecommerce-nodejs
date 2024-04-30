"use strict";

const express = require("express");
const productController = require("../../controllers/ProductController");
const { handlerError } = require("../../helpers/common");
const router = express.Router();
const {authentication} = require("../../auth/authUtils");

// not authentication
router.get("/search/:keySearch", handlerError(productController.getListSearchProduct));

// authentication //
router.use(authentication)

// create product
router.post("", handlerError(productController.createProduct));
// Update product
router.post("/publish/:id", handlerError(productController.publishProductByShop));
router.post("/unpublish/:id", handlerError(productController.unPublishProductByShop));
// query
router.get("/drafts/all", handlerError(productController.getAllDraftsForShop));
router.get("/published/all", handlerError(productController.getAllPublishForShop));
module.exports = router;
