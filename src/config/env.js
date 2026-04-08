const dotenv = require("dotenv");
dotenv.config();

const envObj = {
  port: process.env.PORT,
  mongoDbUrl: process.env.MONGODB_URL,
};

module.exports = envObj;
