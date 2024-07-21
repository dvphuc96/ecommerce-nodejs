"use strict";

const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
  host: "xxxx",
  port: 465,
  secure: true,
  auth: {
    user: "xxx",
    pass: "xxx",
  },
});

module.exports = transport;
