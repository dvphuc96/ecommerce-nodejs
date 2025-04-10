"use strict";

const htmlEmailToken = () => {
  // Generate HTML code for email token
  return `
    <html>
    <body>
      <h1>Welcome to our website!</h1>
      <p>To verify your email, please click the following link:</p>
      <a href="{{link_verify}}">Verify Email</a>
      <p>Thank you for joining!</p>
    </body>
    </html>
    `;
};

module.exports = {
  htmlEmailToken,
};
