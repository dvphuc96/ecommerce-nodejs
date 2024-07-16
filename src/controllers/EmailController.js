"use strict";

const { SuccessResponse } = require("../core/successResponse");
const { createTemplate } = require("../services/TemplateService");

class EmailController {
  createTemplate = async (req, res, next) => {
    // create a new template
    new SuccessResponse({
      message: "Create Template Success!",
      metadata: await createTemplate(req.body),
    }).send(res);
  };
}

module.exports = new EmailController();
