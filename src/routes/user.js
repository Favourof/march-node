const express = require("express");
const { register, login, currentUser } = require("../controller/user");
const { authMiddleWare } = require("../Middleware/verifyToken");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/currentUser", authMiddleWare, currentUser)

module.exports = router;
