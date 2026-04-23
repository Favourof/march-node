const express = require("express");
const {
  addproduct,
  getAllProduct,
  getSinglePRoduct,
  updateProduct,
} = require("../controller/product");
const { authMiddleWare } = require("../Middleware/verifyToken");

const router = express.Router();

// router.use(corsoption);

router.post("/", authMiddleWare, addproduct);
router.get("/", getAllProduct);
router.get("/:id", getSinglePRoduct);
router.patch("/:id", updateProduct);

module.exports = router;
