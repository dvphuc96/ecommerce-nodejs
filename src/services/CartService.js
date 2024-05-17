"use strict";

const { deleteCart } = require("../controllers/CartController");
const { BadRequestError, NotFoundError } = require("../core/errorResponse");
const { cart } = require("../models/cart.model");
const {
  checkCartExists,
  createUserCart,
  updateUserCartQuantity,
  deleteUserCart,
  getListUserCart,
} = require("../models/repositories/cart.repo");
const { findProductById } = require("../models/repositories/product.repo");

/**
 * Key features: Cart service
 * 1: Add product to cart [user]
 * 2: reduce product quantity by one [user]
 * 3: increase product quantity bye one [user]
 * 4: get cart [user]
 * 5: delete all cart [user]
 * 6: delete cart [item]
 */

class CartService {
  static async addProductToCart({ userId, product = {} }) {
    // check cart exists?
    const userCart = await checkCartExists({
      model: cart,
      filter: {
        cart_userId: userId,
      },
    });
    if (!userCart) {
      // create cart for user
      return await createUserCart({ userId, product });
    }

    // nếu có giỏ hàng rồi nhưng chưa có sản phẩm?
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    const index = userCart.cart_products.findIndex((cartProduct) => cartProduct.productId === product.productId);
    if (index === -1) {
      userCart.cart_products.push(product);
      return await userCart.save();
    } else {
      return await updateUserCartQuantity({ userId, product });
    }
  }

  /**
   * Update cart
    shop_order_ids: [
      {
        shopId,
        item_products: [
          {
            quantity,
            price,
            shopId,
            old_quantity,
            productId,
          }
        ],
        version
      }
    ]
   */
  static async updateProductToCart({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    // check cart exists?
    const foundProduct = await findProductById(productId);
    if (!foundProduct) throw new NotFoundError("Product not found");

    // compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("Product do not belong to the shop");
    }

    if (quantity === 0) {
      // deleted
      return await CartService.deleteProductToCart({ userId, productId });
    }

    return await updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteProductToCart({ userId, productId }) {
    return await deleteUserCart({ userId, productId });
  }

  static async getListProductToCart({ userId }) {
    return await getListUserCart({ userId });
  }
}

module.exports = CartService;
