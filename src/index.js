const express = require("express");
const connectDb = require("./config/db");
const envObj = require("./config/env");

const product = [
  {
    id: 3,
    title: "Mens Cotton Jacket",
    price: 55.99,
    description:
      "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
    rating: {
      rate: 4.7,
      count: 500,
    },
  },
  {
    id: 4,
    title: "Mens Cotton Jacket",
    price: 55.99,
    description:
      "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
    rating: {
      rate: 4.7,
      count: 500,
    },
  },
];

const app = express();
app.use(express.json());
const port = envObj.port;

app.get("/", (req, res) => {
  res.send("Hi, welcome to Express js sjkbjskjckbqijok kjdvbjsdbcvdkj");
});

app.post("/product", (req, res) => {
  // console.log(req.rawHeaders, "raw header");
  // console.log(req.params, "param");
  // console.log(req.body.title, "body");
  const { title, price, image, category, description } = req.body;

  if (!title || !price || !image || !category || !description) {
    return res
      .status(400)
      .json({ status: "fail", message: "All field is required" });
  }

  product.push({ id: product.length + 1, ...req.body });
  // product.push({title, price, description, image, rating});

  // const product = req.body;

  // console.log(title, price);

  return res.status(201).json({
    message: "product send sucessfully",
    product,
    length: product.length,
  });
});

app.get("/products", (req, res) => {
  res.send(product);
});

connectDb();

app.listen(port, () => {
  console.log(`Hello our server is runinig on port:${port}`);
});

