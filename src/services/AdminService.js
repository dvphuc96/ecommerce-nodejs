"use strict";

const Resource = require("../models/resource.model");
const Role = require("../models/role.model");

/**
 * New resource
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 */
const createResource = async ({
  name = "profile",
  slug = "pf00001",
  description = "",
}) => {
  try {
    // 1. check name or slug exists

    // 2 create resource
    const resource = await Resource.create({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });
    return resource;
  } catch (error) {
    return error;
  }
};

const resourceList = async ({
  userId = 0, //admin
  limit = 30,
  offset = 0,
  search = "",
}) => {
  try {
    // 1. check admin ? middleware function

    // 2. get list of resource
    const resources = await Resource.aggregate([
      {
        $project: {
          _id: 0,
          name: "$src_name",
          slug: "$src_slug",
          description: "$src_description",
          resourceId: "$_id",
          createAt: 1,
        },
      },
    ]);
    return resources;
  } catch (error) {
    return [];
  }
};

const createRole = async ({
  name = "shop",
  slug = "rl00001",
  description = "extend from shop or user",
  grants = [],
}) => {
  try {
    // 1. check role exists
    // 2. create role
    const role = await Role.create({
      rol_name: name,
      rol_slug: slug,
      rol_description: description,
      rol_grants: grants,
    });

    return role;
  } catch (error) {
    return error;
  }
};

const roleList = async ({
  userId = 0, //admin
  limit = 30,
  offset = 0,
  search = "",
}) => {
  try {
    // 1 check user

    // 2. get list role
    const roles = await Role.aggregate([
      {
        $unwind: "$rol_grants",
      },
      {
        $lookup: { //join mysql
          from: "Resources",
          localField: "rol_grants.resource",
          foreignField: "_id",
          as: "resource",
        },
      },
      {
        $unwind: "$resource",
      },
      {
        $project: {
          role: "$rol_name",
          resource: "$resource.src_name",
          action: "$rol_grants.actions",
          attributes: "$rol_grants.attributes",
        },
      },
      {
        $unwind: "$action",
      },
      {
        $project: {
          _id: 0,
          role: 1,
          resource: 1,
          action: "$action",
          attributes: 1,
        },
      },
    ]);
    return roles;
  } catch (error) {
    return [];
  }
};

module.exports = {
  createResource,
  resourceList,
  createRole,
  roleList,
};
