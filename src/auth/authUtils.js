"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  // publicKey: use verify
  try {
    // access_token
    const accessToken = await JWT.sign(payload, publicKey, {
    //   algorithm: "RS256", // thuật toán dùng cho tạo access_token nâng cao
      expiresIn: "2 days", // time expires: 2day || 1h
    });

    // refreshToken (time expires > time expires of access_token)
    const refreshToken = await JWT.sign(payload, privateKey, {
    //   algorithm: "RS256", // thuật toán dùng cho tạo refreshToken nâng cao
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
  } catch (error) {}
};

module.exports = {
  createTokenPair,
};
