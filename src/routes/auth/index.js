"use strict";

const express = require("express");
const authController = require("../../controllers/AuthController");
const { handlerError } = require("../../auth/checkAuth");
const router = express.Router();

// signup
router.post("/shop/signup", handlerError(authController.signUp));

// login
router.post("/shop/login", handlerError(authController.login));

module.exports = router;
