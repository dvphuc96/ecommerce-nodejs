"use strict";

const { BadRequestError } = require("../core/errorResponse");
const { order } = require("../models/order.model");
const { findCartById } = require("../models/repositories/cart.repo");
const {
  calculateTotalPriceAndDiscount,
} = require("../models/repositories/checkout.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { acquireLock, releaseLock } = require("./RedisService");

class CheckoutService {
  // login and without login
  /* 
  payload:
    {
        cartId,
        userId,
        shop_order_ids: [
            {
                shopId,
                shop_discounts: [],
                item_products: [
                    {
                        productId,
                        quantity,
                        price,
                    }
                ]
            },
            {
                shopId,
                shop_discounts: [
                    {
                        shopId,
                        discountId,
                        codeId,
                    }
                ],
                item_products: [
                    {
                        productId,
                        quantity,
                        price,
                    }
                ]
            }
        ]
    }
  */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // check cartId exists?
    const foundCart = await findCartById(cartId);

    if (!foundCart) throw new BadRequestError("Cart does not exists!");
    let checkout_order = {
        totalPrice: 0, // tổng tiền hàng
        feeShip: 0, // tổng phí ship
        totalDisCount: 0, // tổng discount giảm giá
        totalCheckout: 0, // tổng tiền thanh toán
      },
      shop_order_ids_new = [];

    // tính tổng tiền bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      // check product available
      const checkProductServer = await checkProductByServer(item_products);
      if (!checkProductServer[0]) throw new BadRequestError("Order wrong!!!");

      // tổng tiền đơn hàng
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      // tổng tiền trước khi xử lý
      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tiền trước khi giảm giá
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      // nếu shop_discounts tồn tại > 0, check xem có hợp lệ không?
      if (shop_discounts.length > 0) {
        // giả sử chỉ có 1 discount => get amount discount
        // const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
        //   codeId: shop_discounts[0].codeId,
        //   userId,
        //   shopId,
        //   products: checkProductServer,
        // });

        const { totalPrice, discount } = await calculateTotalPriceAndDiscount(
          shop_discounts,
          userId,
          shopId,
          checkProductServer
        );

        // console.log({totalPrice});
        // tổng cộng discount giảm giá
        checkout_order.totalDisCount += discount;

        // nếu tiền giảm giá > 0 (có giảm giá)
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }
      // tổng tiền thanh toán cuối cùng
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  // order
  static async checkoutOrder({
    cartId,
    userId,
    shop_order_ids,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } = await this.checkoutReview({
      cartId,
      userId,
      shop_order_ids,
    });

    // use flatMap (check lại 1 lần nữa xem có vượt tồn kho hay không ?)
    // get array products
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    // check tra lại nếu có 1 sản phẩm hết hàng
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Một số sản phẩm đã được cập nhật vui lòng kiểm tra lại giỏ hàng..."
      );
    }
    const newOrder = order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    // trường hợp: nếu insert thành công remove product khỏi giỏ hàng
    if (newOrder) {
      // remove product in my cart
    }
    return newOrder;
  }

  /*
      Query orders [users]
   */
  static async getOrdersByUser({}) {}

  /*
      Query order using id [users]
   */
  static async getOneOrderByUser({}) {}

  /*
      cancel order [users]
   */
  static async cancelOrderByUser({}) {}

  /*
      cancel order [users]
   */
  static async cancelOrderByUser({}) {}

  /*
      update order status [shop or admin]
   */
  static async updateOrderByUser({}) {}
}

module.exports = CheckoutService;
