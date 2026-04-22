const express = require("express");
const { addproduct, getAllProduct } = require("../controller/product");
const { authMiddleWare } = require("../Middleware/verifyToken");

const router = express.Router();

router.post("/", authMiddleWare, addproduct);
router.get("/", getAllProduct);

module.exports = router;
