"use strict";

const express = require("express");
const authController = require("../../controllers/AuthController");
const router = express.Router();

// signup
router.post('/shop/signup', authController.signUp)

module.exports = router;
