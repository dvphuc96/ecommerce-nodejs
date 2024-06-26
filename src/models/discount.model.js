"use strict";
const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

// Declare the Schema of the Mongo model
var discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      // percentage
      type: String,
      default: "fixed_amount",
    },
    discount_value: {
      // 10.000, 10
      type: Number,
      required: true,
    },
    discount_max_value: {
      type: Number,
      required: true,
    },
    discount_code: {
      // discount code
      type: String,
      required: true,
    },
    discount_start_date: {
      // start date
      type: Date,
      required: true,
    },
    discount_end_date: {
      // end date
      type: Date,
      required: true,
    },
    discount_max_uses: {
      // maximum number of uses
      type: Number,
      required: true,
    },
    discount_uses_count: {
      // discount number has been used
      type: Number,
      required: true,
    },
    discount_users_used: {
      // Who used it?
      type: Array,
      default: [],
    },
    discount_max_uses_per_user: {
      // số lượng cho phép tối đa được sử dụng mỗi user
      type: Number,
      required: true,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: {
      // số sản phẩm được áp dụng đối với specific
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
