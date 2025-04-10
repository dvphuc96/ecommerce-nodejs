"use strict";

const { ConflictRequestError } = require("../core/errorResponse");
const templateModel = require("../models/template.model");
const { htmlEmailToken } = require("../utils/template.html");

const createTemplate = async ({ template_id, template_name }) => {
  // 1. check if template exists
  const existingTemplate = await templateModel.findOne({ template_name }).lean();
  if (existingTemplate) throw new ConflictRequestError("Template name already exists!");

  // 2. create a new template
  const newTemplate = await templateModel.create({
    template_id,
    template_name, // unique name
    template_html: htmlEmailToken(),
  });
  return newTemplate;
};

const getTemplate = async ({ template_name }) => {
  const template = await templateModel.findOne({ template_name });
  return template;
};

module.exports = {
  createTemplate,
  getTemplate,
};
