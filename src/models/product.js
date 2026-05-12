const mongoose = require("mongoose");
const { modelName } = require("./user");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
    minlength: [3, "Title must have at least 3 characters"],
    maxlength: [100, "Title must not be more than 100 Characters"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: [12, "Description must have at least 3 characters"],
    maxlength: [300, "Description must not be more than 100 Characters"],
    trim: true,
  },

  price: {
    type: Number,
    required: [true, "Price is required"],
  },

  category: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("product", productSchema);
