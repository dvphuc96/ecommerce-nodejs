"use strict";
const keyTokenModel = require("../models/key-token");
class KeyTokenService {
  static createKeyTokenAdvanced = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
  static createKeyTokenBasic = async ({ userId, publicKey, privateKey }) => {
    try {
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey,
        privateKey,
      });
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
