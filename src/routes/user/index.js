"use strict";

const express = require("express");
const { createUserController, checkLoginEmailToken } = require("../../controllers/UserController");
const { handlerError } = require("../../helpers/common");
const router = express.Router();

router.post("/new_user", handlerError(createUserController));
router.get("/verify_email", handlerError(checkLoginEmailToken));

module.exports = router;
