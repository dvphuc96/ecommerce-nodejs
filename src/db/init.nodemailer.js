"use strict";

const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
  host: process.env.AWS_HOST_MAILER,
  port: process.env.AWS_PORT_MAILER,
  secure: true,
  auth: {
    user: process.env.AWS_USER_MAILER,
    pass: process.env.AWS_PASS_MAILER,
  },
});

module.exports = transport;
