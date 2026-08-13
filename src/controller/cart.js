const Cart = require("../models/cart");
const Product = require("../models/product");

const calculateCartTotals = (cart) => {
  let totalItems = 0;
  let totalAmount = 0;

  if (cart && cart.items && cart.items.length > 0) {
    cart.items.forEach((item) => {
      totalItems += item.quantity;
      if (item.product && item.product.price) {
        totalAmount += item.quantity * item.product.price;
      }
    });
  }

  return { totalItems, totalAmount };
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const totals = calculateCartTotals(cart);

    return res.status(200).json({
      status: true,
      message: "Cart retrieved successfully",
      cart,
      totalItems: totals.totalItems,
      totalAmount: totals.totalAmount,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message || "Error retrieving cart" });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ status: false, message: "productId is required" });
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({ status: false, message: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity: parsedQuantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += parsedQuantity;
      } else {
        cart.items.push({ product: productId, quantity: parsedQuantity });
      }
    }

    await cart.save();
    cart = await cart.populate("items.product");

    const totals = calculateCartTotals(cart);

    return res.status(200).json({
      status: true,
      message: "Item added to cart successfully",
      cart,
      totalItems: totals.totalItems,
      totalAmount: totals.totalAmount,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message || "Error adding item to cart" });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ status: false, message: "Quantity is required" });
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity)) {
      return res.status(400).json({ status: false, message: "Valid quantity is required" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ status: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ status: false, message: "Item not found in cart" });
    }

    if (parsedQuantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = parsedQuantity;
    }

    await cart.save();
    cart = await cart.populate("items.product");

    const totals = calculateCartTotals(cart);

    return res.status(200).json({
      status: true,
      message: "Cart updated successfully",
      cart,
      totalItems: totals.totalItems,
      totalAmount: totals.totalAmount,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message || "Error updating cart item" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ status: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    cart = await cart.populate("items.product");

    const totals = calculateCartTotals(cart);

    return res.status(200).json({
      status: true,
      message: "Item removed from cart successfully",
      cart,
      totalItems: totals.totalItems,
      totalAmount: totals.totalAmount,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message || "Error removing item from cart" });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return res.status(200).json({
      status: true,
      message: "Cart cleared successfully",
      cart: cart || { user: userId, items: [] },
      totalItems: 0,
      totalAmount: 0,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message || "Error clearing cart" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
