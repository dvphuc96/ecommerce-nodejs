"use strict";

const { findById } = require("../services/ApiKeyService");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const checkApiKey = async (req, res, next) => {
  if (req.path === '/api-docs' || req.path.startsWith('/api-docs/')) {
    return next();
  }
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    // check ObjectKey
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    const permissions = req.objKey.permissions;
    if (!permissions) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }
    console.log({ permissions });
    const validPermission = permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }
    return next();
  };
};

module.exports = {
  checkApiKey,
  checkPermission,
};
