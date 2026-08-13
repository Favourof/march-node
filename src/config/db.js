const mongoose = require("mongoose");
const envObj = require("./env");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(envObj.mongoDbUrl);
    if (connect) {
      console.log("MongoDB connected successfully");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

module.exports = connectDb;

