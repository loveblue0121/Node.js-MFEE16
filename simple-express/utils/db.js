require('dotenv').config();
const mysql = require("mysql");
const Promise = require("bluebird");
//資料庫連線
let connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
  });
  connection = Promise.promisifyAll(connection);

module.exports = connection;
//必須要用module.exports = connection;