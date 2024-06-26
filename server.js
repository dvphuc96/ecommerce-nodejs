const app = require("./src/app");
const express = require('express');
const router = express.Router();
const PORT = process.env.PORT || 3056;
const server = app.listen(PORT, () => {
  console.log(`wsv ecommerce start with ${PORT}`);
});

router.get("/checkstatus", (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: 'api ok',
  })
});

// process.on('SIGINT', () => {
//     server.close(() => console.log('Exit Server Express'));
// })
