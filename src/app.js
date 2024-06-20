const compression = require("compression");
require("dotenv").config();
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { checkOverloadConnect } = require("./helpers/check-connect");
const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// init db
require("./db/init.mongodb");
// check overload connect
// checkOverloadConnect()
// init routes
app.use("/", require("./routes"));
// handle error

// middleware
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// function handle error
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack, // stack dùng để debug chỉ sử dụng trong env dev
    message: error.message || "Internal Server Error",
  });
});
module.exports = app;
