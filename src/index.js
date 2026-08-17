const express = require("express");
const connectDb = require("./config/db");
const envObj = require("./config/env");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const cors = require("cors");
const { verifyTransport, sendMail } = require("./utils/email");

const app = express();
app.use(express.json());

app.use(cors());
const port = envObj.port;

app.use("/api/auth", userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);

const multer = require("multer");

app.get("/", (req, res) => {
  res.send("Hi, welcome to Express js");
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler caught an error:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: false,
      message: `File upload error: ${err.message}`,
    });
  }

  if (err) {
    return res.status(400).json({
      status: false,
      message: err.message || "An error occurred during request processing",
    });
  }

  next();
});

connectDb();

verifyTransport();
// sendMail();

app.listen(port, () => {
  console.log(`Hello our server is running on port:${port}`);
});
