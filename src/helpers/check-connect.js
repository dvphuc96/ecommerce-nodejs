"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const { notify } = require("../app");
const _SECONDS = 5000;
// count connect
const countConnect = () => {
  const numberConnection = mongoose.connections.length;
  console.log(`Number of Connections::${numberConnection}`);
};

// check overload connect
const checkOverloadConnect = () => {
  setInterval(() => {
    // get number connect
    const numberConnection = mongoose.connections.length;
    // get core cpu
    const numCores = os.cpus().length;
    // get memoryUsage
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number of connections based on number of cores
    const maxConnections = numCores * 5;
    console.log(`Active connections:${numberConnection}`);
    // console.log(`Core CPU:${numCores}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);
    if (numberConnection > maxConnections) {
      console.error(`Error: too many connections`);
      // notify.send()
    }
  }, _SECONDS); // monitor every 5 seconds
};

module.exports = { countConnect, checkOverloadConnect };
