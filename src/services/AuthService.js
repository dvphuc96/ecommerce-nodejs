"use strict";
const shopModel = require("../models/shop");
const bcrypt = require("bcrypt");
// const crypto = require("crypto");
const crypto = require("node:crypto"); // phiên bản tạo key thông thường dùng crypto của node
const RoleShop = require("../constants/roles");
const KeyTokenService = require("./KeyTokenService");
const { createTokenPair, verifyToken } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  ConflictRequestError,
  ForbiddenRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/errorResponse");
const { findShopByEmail } = require("./ShopService");
class AuthService {
  /**
   * SignUp Service
   * @param {*} param0
   * @returns
   */
  static signUp = async ({ name, email, password }) => {
    // check email exists??
    const shopExists = await shopModel.findOne({ email }).lean();
    if (shopExists) {
      throw new ConflictRequestError("Error: Shop already registered!");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      // create privateKey, publicKey use package: crypto (nâng cao dùng cho các dự án lớn (aws, cloud))
      // sử dụng thuật toán bất đối xứng (rsa)
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1", // Public key cryptoGraphy  Standards!
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1", // Public key cryptoGraphy  Standards!
      //     format: "pem",
      //   },
      // });
      // const publicKeyString = await KeyTokenService.createKeyTokenAdvanced({
      //     userId: newShop._id,
      //     publicKey,
      //     privateKey
      //   });
      //   if (!publicKeyString) {
      //     return {
      //       code: "xxxx",
      //       message: "Something went wrong!",
      //       status: "error",
      //     };
      //   }

      //   const publicKeyObject = crypto.createPublicKey(publicKeyString);
      //   console.log("publicKeyObject::", publicKeyObject);

      // create token pair
      // const tokens = await createTokenPair(
      //     { userId: newShop._id, email },
      //     publicKeyObject,
      //     privateKey
      //   );
      //   return {
      //     code: 201,
      //     metadata: {
      //       shop: getInfoData({
      //         fileds: ["_id", "name", "email"],
      //         object: newShop,
      //       }),
      //       tokens,
      //     },
      //   };

      // cách thông thường hay dùng (basic)
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      console.log(privateKey, publicKey); // save collection keystore

      const keyStore = await KeyTokenService.createKeyTokenBasic({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        throw new ForbiddenRequestError("Error: KeyStore error!");
      }
      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log("Create Token Success", tokens);
      return {
        shop: getInfoData({
          fileds: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };

  /**
   * Login Service
   * @param {*} param0
   * @returns
   */
  static login = async ({ email, password, refreshToken = null }) => {
    /*
     * Step 1: check email in database
     * Step 2: match password
     * Step 3: create access_token and refresh_token in database
     * Step 4: generate tokens
     * Step 5: get data return login
     */

    // 1: check email in database
    const shop = await findShopByEmail({ email });
    if (!shop) throw new BadRequestError("Shop not registered!");

    // 2: match password
    const match = await bcrypt.compare(password, shop.password);
    if (!match) throw new AuthFailureError("Authentication error!");

    // 3: create access_token and refresh_token in database
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // 4: generate tokens
    // create token pair
    const { _id: userId } = shop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyTokenBasic({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey: publicKey,
    });
    return {
      shop: getInfoData({ fileds: ["_id", "name", "email"], object: shop }),
      tokens,
    };
  };

  /**
   * Logout Service
   * @param {*} keyStore
   * @returns
   */
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyByUserId(keyStore._id);
    console.log({ delKey });
    return delKey;
  };

  /**
   * Refresh Token Service
   * @param {*} param0
   * @returns
   */
  static refreshToken = async ({ keyStore, user, refreshToken }) => {
    /*
     * 1: check this token used.
     * 2: match password
     * 3: create access_token and refresh_token in database
     * 4: generate tokens
     * 5: get data return login
     */

    const { userId, email } = user;

    // check refreshToken used?
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError("Invalid detected, Please re-login");
    }

    // check refreshToken is valid?
    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("Shop not registered!");
    }

    const shop = await findShopByEmail({ email });
    if (!shop) throw new AuthFailureError("Shop not registered!");

    // create tokens new (accessToken, refreshToken)
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    // update token
    await keyStore.update({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        findKeyByRefreshTokenUsed: refreshToken, // đã được sử dụng để lấy token mới rồi.
      },
    });
    return {
      user,
      tokens,
    };
  };
}

module.exports = AuthService;
