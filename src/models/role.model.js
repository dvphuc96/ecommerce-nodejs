"use strict";
const { model, Schema } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "Roles";
// Declare the Schema of the Mongo model

// const grantList = [
//     {role: 'admin', resource: 'profile', action: 'update:any', attributes: "*"},
//     {role: 'admin', resource: 'balance', action: 'update:any', attributes: "*, !mount"},

//     {role: 'shop', resource: 'profile', action: 'update:own', attributes: "*"},
//     {role: 'shop', resource: 'balance', action: 'update:own', attributes: "*, !mount"},

//     {role: 'user', resource: 'profile', action: 'update:own', attributes: "*"},
//     {role: 'user', resource: 'balance', action: 'read:any', attributes: "*"},
// ]

var roleSchema = new Schema(
  {
    rol_name: {
      // profile
      type: String,
      default: "user",
      enum: ["user", "shop", "admin"],
    },
    rol_slug: {
      //000001
      type: String,
      require: true,
    },
    rol_status: {
      type: String,
      default: "active",
      enum: ["pending", "active", "block"],
    },
    rol_description: {
      type: String,
      default: "",
    },
    rol_grants: [
      {
        resource: {
          type: Schema.Types.ObjectId,
          ref: "Resource",
          require: true,
        },
        actions: [{ type: String, require: true }],
        attributes: { type: String, default: "*" },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, roleSchema);
