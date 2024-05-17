"use strict";

const express = require("express");
const cartController = require("../../controllers/CartController");
const { handlerError } = require("../../helpers/common");
const router = express.Router();

// authentication //
// router.use(authentication);

// create product
router.post("", handlerError(cartController.addCart));

// update
router.post("/update", handlerError(cartController.updateCart));

// delete
router.delete("", handlerError(cartController.deleteCart));
// query
router.get("", handlerError(cartController.getListCart));

module.exports = router;
