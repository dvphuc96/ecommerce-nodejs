"use strict";

const express = require("express");
const {
  createResourceController,
  createRoleController,
  resourceListController,
  roleListController,
} = require("../../controllers/AdminController");
const { handlerError } = require("../../helpers/common");
const router = express.Router();

router.post("/role", handlerError(createRoleController));
router.get("/roles", handlerError(roleListController));

router.post("/resource", handlerError(createResourceController));
router.get("/resources", handlerError(resourceListController));

module.exports = router;
