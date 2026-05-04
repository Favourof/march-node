const express = require("express");
const {
  addproduct,
  getAllProduct,
  getSinglePRoduct,
  updateProduct,
} = require("../controller/product");
const { authMiddleWare } = require("../Middleware/verifyToken");
const { upload } = require("../utils/multer");

const router = express.Router();

router.post("/", authMiddleWare, upload.single("image"), addproduct);
router.get("/", getAllProduct);
router.get("/:id", getSinglePRoduct);
router.patch("/:id", updateProduct);

module.exports = router;
