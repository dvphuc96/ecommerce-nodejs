"use strict";

const { product, electronic, clothing, furniture } = require("../product");
const {
  Types: { ObjectId },
} = require("mongoose");

const {
  getSelectData,
  getUnSelectData,
  convertToObjectId,
} = require("../../utils");

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean()
    .exec();
  return results;
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const shop = await product.findOne({
    product_shop: new ObjectId(product_shop),
    _id: new ObjectId(product_id),
  });
  if (!shop) return null;
  const filter = { _id: shop._id, product_shop: shop.product_shop };
  const update = { $set: { isDraft: false, isPublished: true } };
  const options = {
    upsert: true,
    new: true,
  };
  const { modifiedCount } = await product.updateOne(filter, update, options);
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const shop = await product.findOne({
    product_shop: new ObjectId(product_shop),
    _id: new ObjectId(product_id),
  });
  if (!shop) return null;
  const filter = { _id: shop._id, product_shop: shop.product_shop };
  const update = { $set: { isDraft: true, isPublished: false } };
  const options = {
    upsert: true,
    new: true,
  };
  const { modifiedCount } = await product.updateOne(filter, update, options);
  return modifiedCount;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();
  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(getUnSelectData(unSelect));
};

const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, payload, { new: isNew });
};

const findProductById = async (productId) => {
  return await product.findOne({ _id: convertToObjectId(productId) }).lean();
};

module.exports = {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  findProductById,
};
