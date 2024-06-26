"use strict";

const shopModel = require("../models/shop");
const { convertToObjectId } = require("../utils");

/**
 * Find Shop By Email
 * @param {*} param0 
 * @returns 
 */
const findShopByEmail = async ({
  email,
  select = {email: 1, password: 1, name: 1, status: 1, roles: 1},
}) => {
  return await shopModel.findOne({ email }).select(select).lean();
};

const findShopNameById = async (shop_id) => {
   const result = await shopModel.findOne({ _id: convertToObjectId(shop_id) }).select({name: 1}).lean();
   return result.name ?? null;
}

module.exports = {
  findShopByEmail,
  findShopNameById,
};
