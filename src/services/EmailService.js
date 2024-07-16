"use strict";

const { BadRequestError, NotFoundError } = require("../core/errorResponse");
const transport = require("../db/init.nodemailer");
const { replacePlaceholder } = require("../utils");
const { createOtp } = require("./OtpService");
const { getTemplate } = require("./TemplateService");

const sendEmailLinkVerify = async ({
  html = null,
  toEmail = null,
  subject = "Verify your email",
  text = 'confirm',
}) => {
  try {
    const mailOptions = {
      from: '"SHOPDEV" <anonystick@gmail.com>',
      to: toEmail,
      subject,
      text,
      html,
    };
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log("Email sent: %s", info.messageId); 
    });
  } catch (error) {
    console.error(`Error Send Email::`, error);
    return error;
  }
};
const sendEmailToken = async ({ email = null }) => {
  try {
    if (!email) throw new BadRequestError("Email doesn't exist");

    // 1. get token
    const token = await createOtp({ email });
    // 2. get template

    const template = await getTemplate({
      template_name: "HTML_VERIFY_EMAIL_TOKEN",
    });
    if (!template) throw new NotFoundError("Template Not Found");

    // replace placeholder with params
    const content = replacePlaceholder(template.template_html, {
      link_verify: `http://localhost:3055/v1/api/user/verify_email?token=${token.otp_token}`,
    });
    // 4 .send email
    sendEmailLinkVerify({
      html: content,
      toEmail: email,
      subject: "Verify your email to sign up for Shop-Ecommerce",
    }).catch(err => console.error(err));
    return 1;
  } catch (error) {
    return error;
  }
};

module.exports = sendEmailToken;
