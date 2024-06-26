"use strict";
const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

// Declare the Schema of the Mongo model
var cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    cart_products: {
      /*
            [
                // nên query ở db để check xem đúng dữ liệu không?
                {
                    productId,
                    shopId,
                    quantity,
                    name,
                    price 
                }
            ]
         */
      type: Array,
      required: true,
      default: [],
    },
    cart_count_product: {
      type: Number,
      default: 0,
    },
    // xem những video sau
    cart_userId: {
      type: Number,
      required: true,
    },
  },
  {
    // muốn thay đổi timestamps thì viết như sau
    // timestamps: {
    //     createdAt: "createdOn",
    //     updatedAt: "updatedOn"
    // },
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema),
};
