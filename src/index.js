const express = require("express");
const connectDb = require("./config/db");
const envObj = require("./config/env");
const userRoute = require("./routes/user");

const app = express();
app.use(express.json());
const port = envObj.port;

app.use("/api/auth", userRoute);

app.get("/", (req, res) => {
  res.send("Hi, welcome to Express js sjkbjskjckbqijok kjdvbjsdbcvdkj");
});

connectDb();

app.listen(port, () => {
  console.log(`Hello our server is runinig on port:${port}`);
});

// mongodb+srv://favourtobiloba200_db_user:0tIXjNU8P5TH5R6Q@march-node.uf6h9wc.mongodb.net/?appName=march-node
