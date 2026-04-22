const mongoose = require("mongoose");
const { modelName } = require("./user");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
    minlenght: [3, "Title must have atleast 3 characters"],
    maxlenght: [100, "Title must not be more than 100 Characters"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlenght: [12, "Description must have atleast 3 characters"],
    maxlenght: [300, "Description must not be more than 100 Characters"],
    trim: true,
  },

  price: {
    type: Number,
    required: true,
    min: 100,
  },

  category: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("product", productSchema);
