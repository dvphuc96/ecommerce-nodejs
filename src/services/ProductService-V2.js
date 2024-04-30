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
} = require("../models/repositories/product");

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

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({product_shop, product_id});
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({product_shop, product_id});
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
  static async searchProducts({keySearch}) {
    return await searchProductByUser({ keySearch });
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

  // create new product
  async createProduct(productId) {
    return await product.create({ ...this, _id: productId });
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
}

// register product types
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furnitures);

module.exports = ProductFactory;
