"use strict";

const express = require("express");
const authController = require("../../controllers/AuthController");
const { handlerError } = require("../../helpers/common");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

// signup
router.post("/shop/signup", handlerError(authController.signUp));

// login
router.post("/shop/login", handlerError(authController.login));

// authentication
router.use(authentication)

// logout
router.post("/shop/logout", handlerError(authController.logout));

// refresh Token
router.post("/shop/refreshToken", handlerError(authController.refreshToken));

module.exports = router;
