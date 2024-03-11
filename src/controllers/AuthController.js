"use strict";

const AuthService = require("../services/AuthService");
const { OK, CREATED, SuccessResponse } = require("../core/successResponse");
class AuthController {
  /**
   * SignUp Controller
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  signUp = async (req, res, next) => {
    const a = new CREATED({
      message: "Sign Up Success",
      metadata: await AuthService.signUp(req.body), // có thể thay đổi tên tuỳ ý (response, data...)
    }).send(res);
  };

  /**
   * Login Controller
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  login = async (req, res, next) => {
    new SuccessResponse({
      message: "Login Success",
      metadata: await AuthService.login(req.body),
    }).send(res);
  };

  /**
   * Logout Controller
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout Success",
      metadata: await AuthService.logout(req.keyStore),
    }).send(res);
  };

  /**
   * Refresh Token Controller
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  refreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Refresh Token Success",
      metadata: await AuthService.refreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };
}

module.exports = new AuthController();
