const mongoose = require("mongoose");
const envObj = require("./env");

const connectDb = async (req, res) => {
  try {
    const connect = await mongoose.connect(envObj.mongoDbUrl);
    if (connect) {
      console.log("MomgoDb connected");
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "error", message: "internal server error" });
  }
};

module.exports = connectDb;
