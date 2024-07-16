"use strict";
const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Template";
const COLLECTION_NAME = "Templates";

// Declare the Schema of the Mongo model
var templateSchema = new Schema(
  {
    template_id: {
      type: Number,
      required: true,
    },
    template_name: {
      type: String,
      required: true,
    },
    template_status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },
    template_html: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, templateSchema);
