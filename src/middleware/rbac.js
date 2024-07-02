"use strict";
// rbac: Role-Based Access Control
const { AuthFailureError } = require("../core/errorResponse");
const { roleList } = require("../services/AdminService");
const rbac = require("./role.middleware");
/**
 *
 * @param {string} action // read, update, delete, create
 * @param {*} resource // profile, balance...
 */
const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      rbac.setGrants(await roleList({
        userId: 9999,
      }));
      const roleName = req.query.role;
      const permission = rbac.can(roleName)[action](resource);
      if (!permission.granted) {
        throw new AuthFailureError("You don't have enough permission");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  grantAccess,
};
