"use strict";

const InventoryService = require("../services/InventoryService");
const { SuccessResponse } = require("../core/successResponse");
const dataProfiles = [
  {
    user_id: 1,
    usr_slug: "000001",
    user_name: "John Doe",
    user_email: "john.doe@example.com",
  },
  {
    user_id: 2,
    usr_slug: "000002",
    user_name: "John Doe 2",
    user_email: "john.doe2@example.com",
  },
  {
    user_id: 3,
    usr_slug: "000003",
    user_name: "John Doe 3",
    user_email: "john.doe3@example.com",
  },
];
class ProfileController {
  // Admin
  profiles = async (req, res, next) => {
    new SuccessResponse({
      message: "Get All Profiles Success!",
      metadata: dataProfiles,
    }).send(res);
  };
  
  // shop
  profile = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Profile Success!",
      metadata: {
        user_id: 2,
        usr_slug: "000002",
        user_name: "John Doe 2",
        user_email: "john.doe2@example.com",
      },
    }).send(res);
  };
}

module.exports = new ProfileController();
