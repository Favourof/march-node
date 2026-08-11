const { cloudinary } = require("../config/cloudinary");
const Product = require("../models/product");

const addproduct = async (req, res) => {
  try {
    console.log(req.body, "hello");

    const { title, description, price, category } = req.body;
    // console.log(req.file);

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
    res
      .status(400)
      .json({
        message: error.message || "validation error",
        errors: error,
        status: false,
      });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const product = await Product.find();
    return res.status(200).json({
      status: true,
      message: "get product Successful",
      product,
      count: product.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, status: false });
  }
};

const getSinglePRoduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not Found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Successful", product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, status: false });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res
        .status(404)
        .json({ status: false, message: "Product not Found" });
    }

    let updateData = { ...req.body };

    if (req.file) {
      if (existingProduct.publicId) {
        try {
          await cloudinary.uploader.destroy(existingProduct.publicId);
        } catch (err) {
          console.log("Cloudinary image delete error during update:", err);
        }
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "march-products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      updateData.image = uploadResult.secure_url;
      updateData.publicId = uploadResult.public_id;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    });

    return res
      .status(200)
      .json({ status: true, message: "Product Update Successfully", product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, status: false });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not Found" });
    }

    if (product.publicId) {
      try {
        await cloudinary.uploader.destroy(product.publicId);
      } catch (err) {
        console.log("Cloudinary image delete error:", err);
      }
    }

    await Product.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ status: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, status: false });
  }
};

module.exports = {
  addproduct,
  getAllProduct,
  getSinglePRoduct,
  updateProduct,
  deleteProduct,
};
