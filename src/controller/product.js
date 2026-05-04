const { cloudinary } = require("../config/cloudinary");
const Product = require("../models/product");

const addproduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    console.log(req.file);

    if (!title || !description || !price || !category || !req.file) {
      return res
        .status(400)
        .json({ status: false, message: "All field are required" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "march-products" },
      async (error, result) => {
        if (error) {
          console.log(error);

          return res.status(500).json({ message: "Cloudinary upload failed" });
        }
        console.log(result, "from cludinary");

        const product = {
          ...req.body,
          image: result.secure_url,
          publicId: result.public_id,
        };

        await Product.create(product);

        if (product) {
          return res
            .status(201)
            .json({ message: "product created Succefully", product });
        }
      },
    );
    stream.end(req.file.buffer);
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
