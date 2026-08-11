const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controller/cart");
const { authMiddleWare } = require("../Middleware/verifyToken");

const router = express.Router();

router.get("/", authMiddleWare, getCart);
router.post("/", authMiddleWare, addToCart);
router.put("/:productId", authMiddleWare, updateCartItem);
router.delete("/:productId", authMiddleWare, removeFromCart);
router.delete("/", authMiddleWare, clearCart);

module.exports = router;
