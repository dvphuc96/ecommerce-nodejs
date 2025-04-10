"use strict";

const userModel = require("../user.model");

/**
 * Create a new User
 * @param {*} param0 
 * @returns 
 */
const createUserRepo = async ({
  usr_id,
  usr_name,
  usr_email,
  usr_slug,
  usr_password,
  usr_role,
}) => {
  const newUser = await userModel.create({
    usr_id,
    usr_name,
    usr_email,
    usr_slug,
    usr_password,
    usr_role,
  });
  return newUser;
};

module.exports = {
  createUserRepo,
};
