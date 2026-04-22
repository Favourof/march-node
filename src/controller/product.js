const Product = require("../models/product");

const addproduct = async (req, res) => {
  try {
    const { title, description, price, category, image } = req.body;

    if (!title || !description || !price || !category || !image) {
      return res
        .status(400)
        .json({ status: false, message: "All field are required" });
    }

    const product = await Product.create(req.body);
    console.log(req.body);
    return res
      .status(200)
      .json({ status: true, message: "product Created Succefully", product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, status: false });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const product = await Product.find();
    return res.status(200).json({
      status: true,
      message: "get product Successful",
      product,
      count: product.lenght,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, status: false });
  }

  // res.
};

module.exports = { addproduct, getAllProduct };
