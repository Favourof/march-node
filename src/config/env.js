const dotenv = require("dotenv");
dotenv.config();

const envObj = {
  port: process.env.PORT,
  mongoDbUrl: process.env.MONGODB_URL,
  jwtSecretKey: process.env.JWT_SECRET,
  jwtExpries: process.env.JWT_EXPIRES_IN,
  cloudName: process.env.CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};

module.exports = envObj;
