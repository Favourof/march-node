const express = require("express");
const {
  addproduct,
  getAllProduct,
  getSinglePRoduct,
  updateProduct,
  deleteProduct,
} = require("../controller/product");
const { authMiddleWare, adminMiddleware } = require("../Middleware/verifyToken");
const { upload } = require("../utils/multer");

const router = express.Router();

router.post("/", authMiddleWare, adminMiddleware, upload.single("image"), addproduct);
router.get("/", getAllProduct);
router.get("/:id", getSinglePRoduct);
router.patch("/:id", authMiddleWare, adminMiddleware, upload.single("image"), updateProduct);
router.delete("/:id", authMiddleWare, adminMiddleware, deleteProduct);

module.exports = router;
