const express = require("express");
const { register, login, currentUser } = require("../controller/user");
const { authMiddleWare } = require("../Middleware/verifyToken");
const { registerValidator, loginValidator } = require("../validators/user");

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.get("/currentUser", authMiddleWare, currentUser);

module.exports = router;
