"use strict";

const InventoryService = require("../services/InventoryService");
const { SuccessResponse } = require("../core/successResponse");
class InventoryController {
  /**
   * Add Stock To Inventory
   * @param {*} req
   * @param {*} res
   * @param {*} next
   *
   */
  addStockToInvetory = async (req, res, next) => {
    new SuccessResponse({
      message: "Add Stock To Inventory Success!",
      metadata: await InventoryService.addStockToInvetory(req.body),
    }).send(res);
  };
}

module.exports = new InventoryController();
