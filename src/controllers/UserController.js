"use strict";

const { SuccessResponse } = require("../core/successResponse");
const { createUserService, checkLoginEmailTokenService } = require("../services/UserService");
class UserController {
  // new user
  createUserController = async (req, res, next) => {
    const result = await createUserService({
        email: req.body.email,
      // add captcha check here to avoid spam bots
    })
    new SuccessResponse(result).send(res);
  };
  checkLoginEmailToken = async (req, res, next) => {
    const {token = null} = req.query
    new SuccessResponse({
      message: "Verify Successfully",
      metadata: await checkLoginEmailTokenService({
        token,
      }),
    }).send(res)
  };
}

module.exports = new UserController();
