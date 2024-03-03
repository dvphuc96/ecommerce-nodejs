"use strict";

const JWT = require("jsonwebtoken");
const { handlerError } = require("../helpers/common");
const { AuthFailureError, NotFoundError } = require("../core/errorResponse");
const { findKeyByUserId } = require("../services/KeyTokenService");
const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "x-refresh-token",
};

/**
 * create Token Pair
 * @param {*} payload
 * @param {*} publicKey
 * @param {*} privateKey
 * @returns
 */
const createTokenPair = async (payload, publicKey, privateKey) => {
  // publicKey: use verify
  try {
    // access_token
    const accessToken = await JWT.sign(payload, publicKey, {
      // algorithm: "RS256", // thuật toán dùng cho tạo access_token nâng cao
      expiresIn: "2 days", // time expires: 2day || 1h
    });

    // refreshToken (time expires > time expires of access_token)
    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: "RS256", // thuật toán dùng cho tạo refreshToken nâng cao
      expiresIn: "7 days", // time expires: 7day
    });

    // verify
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("Error verify", err);
      } else {
        console.log("Decode verify", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

/**
 * Middleware authentication
 */
const authentication = handlerError(async (req, res, next) => {
  /*
  Step: 1. check userId missing???
  Step: 2. get accessToken
  Step: 3. verify token
  Step: 4. check user in db
  Step: 5. check keyStore with this userId.
  Step: 6. Ok all => return next() 
  */

  // 1. check userId missing???
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");
  // 2. get accessToken
  const keyStore = await findKeyByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not Found KeyStore");

  console.log(keyStore)
  // 3. check refresh token
  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid User");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  // 4. verify token
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.privateKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid User");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyToken = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyToken,
};
