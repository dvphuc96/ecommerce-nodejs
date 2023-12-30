const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  port: "3355",
  database: "ecommerce-shop",
});

class Database {
  constructor() {
    this.connect();
  }
  connect() {
    connection.connect((error) => {
      if (!!error) console.log(`Error connecting to MySQL server.`, error);
      else
        console.log(`Connected to MySQL server as id ${connection.threadId}`);
    });
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMysql = Database.getInstance();
module.exports = instanceMysql;
