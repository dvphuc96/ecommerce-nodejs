"use strict";

const express = require("express");
const ProfileController = require("../../controllers/ProfileController");
const { grantAccess } = require("../../middleware/rbac");
const router = express.Router();

//admin
router.get("/view-all", grantAccess('readAny', 'profile'),ProfileController.profiles);

//shop
router.get("/view-own", grantAccess('readOwn', 'profile'), ProfileController.profile);

module.exports = router;
