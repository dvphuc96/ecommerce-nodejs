"use strict";

const express = require("express");
const checkoutController = require("../../controllers/CheckoutController");
const { handlerError } = require("../../helpers/common");
const router = express.Router();

// review
router.post("/review", handlerError(checkoutController.checkoutReview));

module.exports = router;
