"use strict";

const {
  ConflictRequestError,
  NotFoundError,
} = require("../core/errorResponse");
const { createUserRepo } = require("../models/repositories/user.repo");
const User = require("../models/user.model");
const sendEmailToken = require("./EmailService");
const { checkEmailToken } = require("./OtpService");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto"); // phiên bản tạo key thông thường dùng crypto của node
const KeyTokenService = require("./KeyTokenService");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData, convertToObjectId } = require("../utils");
const RoleModel = require("../models/role.model");
const createUserService = async ({ email = null, capcha = null }) => {
  // 1. check email exists in dbs
  const hasUser = await findUserByEmailWithLogin({ email });
  if (hasUser) throw new ConflictRequestError("Email already exists!");

  // 2. send token via email user
  const result = await sendEmailToken({
    email,
  });
  return {
    message: "Verify Email successfully",
    metadata: {
      token: result,
    },
  };
};

const checkLoginEmailTokenService = async ({token}) => {
  try {
    // 1. check token in mode otp
    const { otp_email: email, otp_token } = await checkEmailToken({ token });
    if (!email) throw new NotFoundError("Token Not Found");

    // 2. check email exists in user model
    const hasUser = await findUserByEmailWithLogin({email});
    if (hasUser) throw new ConflictRequestError("Email already exists!");

    // 3. create new user
    const passwordHash = await bcrypt.hash(email, 10);
    const role = await RoleModel.findOne({
      rol_name: "user"
    }).lean();
    const newUser = await createUserRepo({
      usr_id: 1,
      usr_name: email,
      usr_email: email,
      usr_slug: `register-${email}`,
      usr_password: passwordHash,
      usr_role: convertToObjectId(role._id),
    });

    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const keyStore = await KeyTokenService.createKeyTokenBasic({
        userId: newUser.usr_id,
        refreshToken: "",
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        throw new ForbiddenRequestError("Error: KeyStore error!");
      }
      // create token pair
      const tokens = await createTokenPair(
        { userId: newUser.usr_id, email },
        publicKey,
        privateKey
      );
      console.log("Create Token Success", tokens);
      return {
        user: getInfoData({
          fileds: ["usr_id", "usr_name", "usr_email"],
          object: newUser,
        }),
        tokens,
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};

const findUserByEmailWithLogin = async ({ email }) => {
  const hasUser = await User.findOne({ usr_email: email });
  return hasUser;
};

module.exports = {
  createUserService,
  checkLoginEmailTokenService,
};
