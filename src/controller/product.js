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

const getSinglePRoduct = async (req, res) => {
  try {
    // const {id } = req.params
    const id = req.params.id;
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "PRoduct not Found" });
    }

    return res
      .status(200)
      .json({ staus: true, message: "Successful", product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, status: false });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params);

    const product = await Product.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
    });

    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "PRoduct not Found" });
    }

    return res
      .status(200)
      .json({ staus: true, message: "Product Update Successfully", product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, status: false });
  }
};

module.exports = { addproduct, getAllProduct, getSinglePRoduct, updateProduct };
