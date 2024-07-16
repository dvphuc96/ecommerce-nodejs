"use strict";

const express = require("express");
const { createTemplate } = require("../../controllers/EmailController");
const { handlerError } = require("../../helpers/common");
const router = express.Router();

router.post("/new_template", handlerError(createTemplate));

module.exports = router;
