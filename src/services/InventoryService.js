"use strict";

const { BadRequestError } = require("../core/errorResponse");
const { inventory } = require("../models/inventory");
const { findProductById } = require("../models/repositories/product.repo");

class InventoryService {
  static async addStockToInvetory({
    productId,
    shopId,
    stock,
    location = "272/16 TCH 10, Tan Chanh Hiep, Quan 12, TP.HoChiMinh",
  }) {
    const product = findProductById(productId);
    if (!product) throw new BadRequestError("The product does not exists!");
    const query = {
        inven_shopId: shopId,
        inven_productId: productId,
      },
      updateSet = {
        $inc: {
          inven_stock: stock,
        },
        $set: {
          inven_location: location,
        },
      },
      options = {
        upsert: true,
        new: true,
      };
    return await inventory.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;
