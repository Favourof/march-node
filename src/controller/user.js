const User = require("../models/user");
const bcrypt = require("bcrypt");
const envObj = require("../config/env");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { sendWelcomingEmail } = require("../utils/email");

const register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, message: errors.array()?.[0].msg });
  }

  const { name, email, password, age, gender, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "User Already Exists" });
    }

    const salt = 12;
    const hashedPassword = await bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      role: role || "user",
    });

    await newUser.save();
    sendWelcomingEmail(name, email);

    return res
      .status(201)
      .json({ status: true, message: "Account created successfully" });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message || "Server error during registration" });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, message: errors.array()?.[0].msg });
  }

  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Credentials" });
    }

    const verifyPassword = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!verifyPassword) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { userId: existingUser._id, role: existingUser.role },
      envObj.jwtSecretKey,
      {
        expiresIn: envObj.jwtExpries,
      }
    );

    const user = {
      name: existingUser.name,
      id: existingUser._id,
      gender: existingUser.gender,
      email: existingUser.email,
      age: existingUser.age,
      role: existingUser.role,
    };

    return res.status(200).json({
      status: true,
      message: "Login successfully",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message || "Server error during login" });
  }
};

const currentUser = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ status: false, message: "Unauthorized access" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Current user profile retrieved successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message || "Server error retrieving profile" });
  }
};

module.exports = { register, login, currentUser };

