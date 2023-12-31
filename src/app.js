const compression = require("compression");
require('dotenv').config()
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const {checkOverloadConnect} = require('./helpers/check-connect');
const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json())
app.use(express.urlencoded({
    extended: true,
}))
// init db
require('./db/init.mongodb')
// check overload connect
// checkOverloadConnect()
// init routes
app.use('/', require("./routes"))
// handle error

module.exports = app;
