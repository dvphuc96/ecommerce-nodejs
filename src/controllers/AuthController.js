"use strict";

const AuthService = require("../services/AuthService");
const { OK, CREATED } = require("../core/successResponse");
class AuthController {
  signUp = async (req, res, next) => {
    const a = new CREATED({
      message: "Sign Up Success",
      metadata: await AuthService.signUp(req.body), // có thể thay đổi tên tuỳ ý (response, data...)
    }).send(res);
  };
}

module.exports = new AuthController();
