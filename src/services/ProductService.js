"use strict";

const { BadRequestError } = require("../core/errorResponse");
const { product, clothing, electronic } = require("../models/product");

// define Factory class to create Product

class ProductFactory {
  /* 
        type: 'clothing',
        payload,
    */
  static async createProduct(type, payload) {
    switch (type) {
      case "Electronic":
        return new Electronics(payload).createProduct();
      case "Clothing":
        return new Clothing(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid Product Type ${type}`);
    }
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
module.exports = ProductFactory;
