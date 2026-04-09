const User = require("../models/user");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { name, email, password, age, gender } = req.body;

  try {
    if (!name || !email || !password || !age || !gender) {
      return res
        .status(402)
        .json({ status: false, message: "All fields is required" });
    }

    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "User Already Exits" });
    }

    const salt = 12;

    const hashedPassword = await bcrypt.hashSync(password, salt);

    console.log(hashedPassword);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
    });

    await newUser.save();
    return res
      .status(200)
      .json({ status: true, message: "Account created succefully" });

    // console.log(existingUser, "user");

    // console.log("succeful");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, status: false });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(402)
        .json({ status: false, message: "All fields is required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Credential" });
    }

    const verifyPassword = await bcrypt.compare(
      password,
      existingUser.password,
    );
    console.log(verifyPassword);
    if (!verifyPassword) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Credential" });
    }

    res.status(200).json({ status: true, message: "Login Succefully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, status: false });
  }
};

module.exports = { register, login };
