const dotenv = require("dotenv");
dotenv.config();

const envObj = {
  port: process.env.PORT,
  mongoDbUrl: process.env.MONGODB_URL,
  jwtSecretKey: process.env.JWT_SECRET,
  jwtExpries: process.env.JWT_EXPIRES_IN
};

module.exports = envObj;
