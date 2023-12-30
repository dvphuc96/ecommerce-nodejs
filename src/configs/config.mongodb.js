"use strict";

//lv0
const dev = {
  app: {
    port: process.env.DEV_APP_PORT,
  },
  database: {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    name: process.env.DEV_DB_NAME,
  },
};
const production = {
  app: {
    port: process.env.PRODUCT_APP_PORT,
  },
  database: {
    host: process.env.PRODUCT_DB_HOST,
    port: process.env.PRODUCT_DB_PORT,
    name: process.env.PRODUCT_DB_NAME,
  },
};

const config = { dev, production };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
