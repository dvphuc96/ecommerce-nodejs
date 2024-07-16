"use strict";

const { NotFoundError } = require("../core/errorResponse");
const OtpModel = require("../models/otp.model");
const { randomInt } = require("crypto");
const generatorTokenRandom = () => {
  // generate token
  const token = randomInt(0, Math.pow(2, 32));
  return token;
};
const createOtp = async ({ email }) => {
  const token = generatorTokenRandom();
  const newOtp = await OtpModel.create({
    otp_token: token,
    otp_email: email,
  });
  return newOtp;
};

const checkEmailToken = async ({ token }) => {
  // check token in model otp
  const hasToken = await OtpModel.findOne({
    otp_token: token,
  });

  if (! hasToken) throw new NotFoundError("Token Not Found");

  // delete token

  OtpModel.deleteOne({ otp_token: token }).then();
  return hasToken;
};

module.exports = {
  createOtp,
  checkEmailToken,
};
