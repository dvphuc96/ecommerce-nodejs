"use strict";
const shopModel = require("../models/shop");
const bcrypt = require("bcrypt");
// const crypto = require("crypto");
const crypto = require("node:crypto"); // phiên bản tạo key thông thường dùng crypto của node
const RoleShop = require("../constants/roles");
const KeyTokenService = require("./KeyTokenService");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  ConflictRequestError,
  ForbiddenRequestError,
} = require("../core/errorResponse");
class AuthService {
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
        metadata: {
          shop: getInfoData({
            fileds: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AuthService;
