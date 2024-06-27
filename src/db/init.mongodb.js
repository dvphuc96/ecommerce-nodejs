"use strict";

const mongoose = require("mongoose");
const connectString = process.env.DATABASE_URL
const { countConnect } = require(".././helpers/check-connect");
// how to check
class Database {
  constructor() {
    this.connect();
  }
  connect(type = "mongodb") {
    // env dev
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString, {
        maxPoolSize: 50
      })
      .then((_) => {
        console.log("Connect Mongodb Success");
        countConnect();
      })
      .catch((err) => console.log(`Error Connect!`));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
