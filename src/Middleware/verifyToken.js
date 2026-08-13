const jwt = require("jsonwebtoken");
const envObj = require("../config/env");
const User = require("../models/user");

const authMiddleWare = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ status: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ status: false, message: "Authentication token missing" });
  }

  try {
    const decoded = jwt.verify(token, envObj.jwtSecretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: error.message || "Invalid or expired token",
    });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: false, message: "Unauthorized access" });
    }

    let userRole = req.user.role;

    if (!userRole) {
      const dbUser = await User.findById(req.user.userId);
      if (!dbUser) {
        return res.status(404).json({ status: false, message: "User not found" });
      }
      userRole = dbUser.role;
    }

    if (userRole !== "admin") {
      return res.status(403).json({ status: false, message: "Access denied. Admin privileges required." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message || "Server error in admin authorization" });
  }
};

module.exports = { authMiddleWare, adminMiddleware };