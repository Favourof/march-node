const express = require("express");
const connectDb = require("./config/db");
const envObj = require("./config/env");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cors = require("cors");
const { verifyTransport, sendMail } = require("./utils/email");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://march-react-cohort.vercel.app",
  }),
);
const port = envObj.port;

app.use("/api/auth", userRoute);
app.use("/api/product", productRoute);

app.get("/", (req, res) => {
  res.send("Hi, welcome to Express js");
});

connectDb();

verifyTransport();
// sendMail();

app.listen(port, () => {
  console.log(`Hello our server is running on port:${port}`);
});
