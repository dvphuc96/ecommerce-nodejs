"use strict";

const AuthService = require("../services/AuthService");
const { OK, CREATED, SuccessResponse } = require("../core/successResponse");
class AuthController {

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AuthService.login(req.body),
    }).send(res);
  }

  signUp = async (req, res, next) => {
    const a = new CREATED({
      message: "Sign Up Success",
      metadata: await AuthService.signUp(req.body), // có thể thay đổi tên tuỳ ý (response, data...)
    }).send(res);
  };
}

module.exports = new AuthController();
