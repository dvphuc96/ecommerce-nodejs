"use strict";
const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Opt_Log";
const COLLECTION_NAME = "Opt_Logs";

// Declare the Schema of the Mongo model
var otpSchema = new Schema(
  {
    otp_token: {
      type: String,
      required: true,
    },
    otp_email: {
      type: String,
      required: true,
    },
    otp_status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "block"],
    },
    expireAt: {
      type: Date,
      default: Date.now(),
      expires: '3d',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, otpSchema);

