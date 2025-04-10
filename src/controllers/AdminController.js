"use strict";

const { SuccessResponse } = require("../core/successResponse");
const {
  createRole,
  createResource,
  resourceList,
  roleList,
} = require("../services/AdminService");

const createResourceController = async (req, res, next) => {
  new SuccessResponse({
    message: "Create Resource Success",
    metadata: await createResource(req.body),
  }).send(res);
};

const createRoleController = async (req, res, next) => {
  new SuccessResponse({
    message: "Create Role Success",
    metadata: await createRole(req.body),
  }).send(res);
};

const resourceListController = async (req, res, next) => {
  new SuccessResponse({
    message: "Get List Resource Success",
    metadata: await resourceList(req.query),
  }).send(res);
};

const roleListController = async (req, res, next) => {
  new SuccessResponse({
    message: "Get List Role Success",
    metadata: await roleList(req.query),
  }).send(res);
};

module.exports = {
  createResourceController,
  createRoleController,
  resourceListController,
  roleListController,
};
