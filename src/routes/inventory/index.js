"use strict";

const express = require("express");
const inventoryController = require("../../controllers/InventoryController");
const { handlerError } = require("../../helpers/common");
const router = express.Router();
const { authentication } = require("../../auth/authUtils");

// authentication //
router.use(authentication);

// addStockToInvetory
router.post("", handlerError(inventoryController.addStockToInvetory));

module.exports = router;
