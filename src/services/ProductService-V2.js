"use strict";

const { BadRequestError } = require("../core/errorResponse");
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product");
const {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const {
  removeUndefinedOrNullObject,
  updateNestedObjectParser,
} = require("../utils");
const { insertInventory } = require("../models/repositories/inventory.repo");

// define Factory class to create Product

class ProductFactory {
  /* 
    type: 'clothing'...,
    payload,
  */

  static productRegistry = {}; // key-class

  static registerProductType(type, clasRef) {
    this.productRegistry[type] = clasRef;
  }

  /**
   * Áp dụng Strategy Advanced
   */
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Type ${type}`);
    }
    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Type ${type}`);
    }
    return new productClass(payload).updateProduct(productId);
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  /**
   * findAllDraftForShop
   * @param {*} param0
   * @returns
   */
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }

  /**
   * findAllPublishForShop
   * @param {*} param0
   * @returns
   */
  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  /**
   * searchProductsByUser
   * @param {*} param0
   * @returns
   */
  static async searchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  /**
   * Find All Product
   * @param {*} param0
   * @returns
   */
  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb", "product_shop"],
    });
  }

  /**
   * Find Detail
   * @param {*} param0
   * @returns
   */
  static async findProduct({ product_id }) {
    return await findProduct({
      product_id,
      unSelect: ["__v", "product_variations"],
    });
  }
}

// define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // super create new product
  async createProduct(productId) {
    const newProduct = await product.create({ ...this, _id: productId });
    if (newProduct) {
      // add product_stock in inventory collection
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }
    return newProduct;
  }

  // super update product
  async updateProduct(productId, payload) {
    console.log(productId);
    return await updateProductById({ productId, payload, model: product });
  }
}

// define sub-class for different product types clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create new clothing error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create new product error");

    return newProduct;
  }

  async updateProduct(productId) {
    // 1. remove attributes has null and undefined
    const objectParams = removeUndefinedOrNullObject(this);

    if (objectParams.product_attributes) {
      const payload = updateNestedObjectParser(objectParams.product_attributes);
      await updateProductById({
        productId,
        payload,
        model: clothing,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

// define sub-class for different product types electronic
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Create new electronic error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create new product error");

    return newProduct;
  }

  async updateProduct(productId) {
    // 1. remove attributes has null and undefined
    const objectParams = removeUndefinedOrNullObject(this);
    if (objectParams.product_attributes) {
      const payload = updateNestedObjectParser(objectParams.product_attributes);
      await updateProductById({ productId, payload, model: electronic });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

// define sub-class for different product types furniture
class Furnitures extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("Create new furniture error");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Create new product error");

    return newProduct;
  }

  async updateProduct(productId) {
    // 1. remove attributes has null and undefined
    const objectParams = removeUndefinedOrNullObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({ productId, objectParams, model: furniture });
    }
    const updateProduct = await super.updateProduct(productId, objectParams);
    return updateProduct;
  }
}

// register product types
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furnitures);

module.exports = ProductFactory;
