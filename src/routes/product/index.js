"use strict";

const express = require("express");
const productController = require("../../controllers/ProductController");
const { handlerError } = require("../../helpers/common");
const router = express.Router();

// create product
router.post("", handlerError(productController.createProduct));

module.exports = router;
