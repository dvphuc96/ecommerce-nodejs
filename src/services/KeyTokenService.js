"use strict";
const keyTokenModel = require("../models/key-token");
const {
  Types: { ObjectId },
} = require("mongoose");
class KeyTokenService {
  /**
   * create KeyToken Advanced
   * @param {*} param0
   * @returns
   */
  static createKeyTokenAdvanced = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  /**
   * create KeyToken Basic
   * @param {*} param0
   * @returns
   */
  static createKeyTokenBasic = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // level 0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return tokens ? tokens.publicKey : null;

      // level xxx
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  /**
   * find Key By UserId
   * @param {*} userId
   * @returns
   */
  static findKeyByUserId = async (userId) => {
    // return await keyTokenModel.findOne({ user: new mongoose.Types.ObjectId(userId) }).lean(); =>
    return await keyTokenModel.findOne({ user: new ObjectId(userId) }).lean();
  };

  /**
   * Remove Key By UserId
   * @param {*} id
   * @returns
   */
  static removeKeyByUserId = async (id) => {
    // return await keyTokenModel.remove(id); =>
    return await keyTokenModel.deleteOne({ _id: new ObjectId(id) });
  };

  /**
   * find Key By RefreshToken
   * @param {*} refreshToken
   * @returns
   */
  static findKeyByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken }).lean();
  };

  /**
   * find Key By RefreshToken
   * @param {*} refreshToken
   * @returns
   */
  static findKeyByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };

  /**
   * Remove Key By UserId
   * @param {*} refreshToken
   * @returns
   */
  static deleteKeyByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({user: new ObjectId(userId)});
  };
}

module.exports = KeyTokenService;
