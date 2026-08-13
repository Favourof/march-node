const { cloudinary } = require("../config/cloudinary");
const Product = require("../models/product");

const addproduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    if (!title || !description || !price || !category || !req.file) {
      return res
        .status(400)
        .json({ status: false, message: "All fields (title, description, price, category, image) are required" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "march-products" },
      async (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ status: false, message: "Cloudinary upload failed", error: error.message });
        }

        try {
          const productData = {
            ...req.body,
            image: result.secure_url,
            publicId: result.public_id,
          };

          const product = await Product.create(productData);

          return res
            .status(201)
            .json({ status: true, message: "Product created successfully", product });
        } catch (dbError) {
          return res.status(500).json({
            status: false,
            message: dbError.message || "Database error while saving product",
          });
        }
      },
    );
    stream.end(req.file.buffer);
  } catch (error) {
    return res
      .status(400)
      .json({
        status: false,
        message: error.message || "Validation error",
      });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const product = await Product.find();
    return res.status(200).json({
      status: true,
      message: "Products retrieved successfully",
      product,
      count: product.length,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message || "Error fetching products" });
  }
};

const getSinglePRoduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Product retrieved successfully", product });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message || "Error fetching product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    let updateData = { ...req.body };

    if (req.file) {
      if (existingProduct.publicId) {
        try {
          await cloudinary.uploader.destroy(existingProduct.publicId);
        } catch (err) {
          console.error("Cloudinary image delete error during update:", err.message);
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
      .json({ status: true, message: "Product updated successfully", product });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message || "Error updating product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    if (product.publicId) {
      try {
        await cloudinary.uploader.destroy(product.publicId);
      } catch (err) {
        console.error("Cloudinary image delete error:", err.message);
      }
    }

    await Product.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ status: true, message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message || "Error deleting product" });
  }
};

module.exports = {
  addproduct,
  getAllProduct,
  getSinglePRoduct,
  updateProduct,
  deleteProduct,
};

