"use strict";

const AuthService = require("../services/AuthService");

class AuthController {
  signUp = async (req, res, next) => {
    console.log(`P::signup::`, req.body);
    return res.status(201).json(await AuthService.signUp(req.body));
  };
}

module.exports = new AuthController();
