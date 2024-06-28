const app = require("./src/app");
const swagger = require("./swagger");

const PORT = process.env.PORT || 3056;
swagger(app);
const server = app.listen(PORT, () => {
  console.log(`wsv ecommerce start with ${PORT}`);
});



// process.on('SIGINT', () => {
//     server.close(() => console.log('Exit Server Express'));
// })
