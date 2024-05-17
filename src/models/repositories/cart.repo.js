"use strict";

const { cart } = require("../cart.model");

/**
 * Check Cart Exists
 * @param {*} param0
 * @returns
 */
const checkCartExists = async ({ model, filter }) => {
  return await model.findOne(filter);
};

/**
 * Create User Cart
 * @param {*} param0
 * @returns
 */
const createUserCart = async ({ userId, product }) => {
  const query = { cart_userId: userId, cart_state: "active" },
    updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    },
    options = { upsert: true, new: true };
  return await cart.findOneAndUpdate(query, updateOrInsert, options);
};

/**
 * Update User Cart Quantity
 * @param {*} param0
 * @returns
 */
const updateUserCartQuantity = async ({ userId, product }) => {
  const { productId, quantity } = product;
  const query = {
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    },
    updateSet = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    },
    options = { upsert: true, new: true };
  return await cart.findOneAndUpdate(query, updateSet, options);
};

/**
 * Delete User Cart
 * @param {*} param0
 * @returns
 */
const deleteUserCart = async ({ userId, productId }) => {
  const query = {
      cart_userId: userId,
      cart_state: "active",
    },
    updateSet = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };
  return await cart.updateOne(query, updateSet);
};

/**
 * Get List User Cart
 * @param {*} param0
 * @returns
 */
const getListUserCart = async ({ userId }) => {
  return await cart
    .findOne({
      cart_userId: +userId,
    })
    .lean();
};

module.exports = {
  checkCartExists,
  createUserCart,
  updateUserCartQuantity,
  deleteUserCart,
  getListUserCart,
};
