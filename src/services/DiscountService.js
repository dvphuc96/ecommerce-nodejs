"use strict";

/**
 * Discount Service
 * 1: Generator discount Code [Shop | Admin]
 * 2: Get discount Amount [User]
 * 3: Get All discount codes [User]
 * 4: Verify discount code [User]
 * 5: Delete discount code [Shop | Admin]
 * 6: Cancel discount code [User]
 */

const { BadRequestError, NotFoundError } = require("../core/errorResponse");
const discount = require("../models/discount.model");
const { product } = require("../models/product");
const {
  checkDiscountExists,
  findAllDisCountCodeUnSelect,
} = require("../models/repositories/discount.repo");
const { convertToObjectId } = require("../utils");
const { findAllProducts } = require("./ProductService-V2");
class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user,
    } = payload;
    // kiểm tra
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code has expried!");
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must be before End date!");
    }

    //create index for discount code
    const fountDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      },
    });
    if (fountDiscount && fountDiscount.discount_is_active) {
      throw new BadRequestError("Discount code exists!");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {}

  /**
   * Get all discount code available with products (User)
   */
  static async getAllDiscountCodeWithProducts({
    code,
    shopId,
    limit,
    page,
  }) {
    console.log({code});
    //create index for discount code
    const fountDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      },
    });

    if (!fountDiscount || !fountDiscount.discount_is_active) {
      throw new NotFoundError("Discount code not found!");
    }

    const { discount_applies_to, discount_product_ids } = fountDiscount;
    let products;
    if (discount_applies_to === "all") {
      // get All Product
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectId(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    if (discount_applies_to === "specific") {
      // get Specific Product ids
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  /**
   * Get all discount code of shop
   * @param {*} payload
   */
  static async getAllDiscountCodes({ limit, page, shopId }) {
    const discounts = await findAllDisCountCodeUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectId(shopId),
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"],
      model: discount,
    });
    return discounts;
  }

  /*
     Apply discount code

   */
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    //create index for discount code
    const fountDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectId(shopId),
      },
    });

    console.log({fountDiscount});
    if (!fountDiscount) {
      throw new NotFoundError("Discount code not found!");
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_users_used,
      discount_max_uses_per_user,
      discount_type,
      discount_value,
    } = fountDiscount;

    if (!discount_is_active) throw new NotFoundError("Discount code expried!");
    if (!discount_max_uses) throw new NotFoundError("Discount code are out!");

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new NotFoundError("Discount code has expried!");
    }

    // Check xem có xét giá trị tối thiểu hay không?
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      // get total
      totalOrder = products.reduce((total, product) => {
        return total + product.product_quantity * product.product_price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `Discount requires a minium order value of ${discount_min_order_value}!`
        );
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUsedDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userUsedDiscount) {
        //...
      }
    }

    const amout =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amout,
      totalPrice: totalOrder - amout,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    // check xem discount có đang được sử dụng ở đâu không?
    const fountDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectId(shopId),
      },
    });

    if (fountDiscount) {
      const deleted = await discount.findOneAndDelete({
        discount_code: codeId,
        discount_shopId: convertToObjectId(shopId),
      });

      return deleted;
    }
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    // check discount có tồn tại không?
    const fountDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectId(shopId),
      },
    });

    if (!fountDiscount) {
      throw new NotFoundError("Discount code not found!");
    }

    const result = await discount.findByIdAndUpdate(fountDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
