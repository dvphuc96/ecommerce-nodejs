"use strict";

const express = require("express");
const discountController = require("../../controllers/DiscountController");
const { handlerError } = require("../../helpers/common");
const router = express.Router();
const { authentication } = require("../../auth/authUtils");

// not authentication

// get amout a discount
router.post("/amount", handlerError(discountController.getDiscountAmount));
// get discount with product
router.get("/list-product-code", handlerError(discountController.getAllDiscountCodeWithProducts));

// authentication //
router.use(authentication);
// create discount
router.post("", handlerError(discountController.createDiscountCode));
// get all discount
router.get("", handlerError(discountController.getAllDiscountCodes));

module.exports = router;
