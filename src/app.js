const compression = require("compression");
require('dotenv').config()
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const {checkOverloadConnect} = require('./helpers/check-connect')
const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
require('./db/init.mongodb')
// check overload connect
// checkOverloadConnect()
// init routes
app.get("/", (req, res, next) => {
  const strCompress = "Hell word";
  return res.status(200).json({
    message: "Wellcome project ecommerce",
    metadata: strCompress.repeat(100000),
  });
});
// handle error

module.exports = app;
