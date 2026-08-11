const jwt = require('jsonwebtoken');
const envObj = require('../config/env');


const authMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: "No Token Provider" });
    }

    const token = authHeader.split(" ")[1]
    // console.log(token, "token");

    try {
        console.log("decode");

        console.log(envObj.jwtSecretKey);
        const decoded = jwt.verify(token, envObj.jwtSecretKey);


        console.log(decoded, "decode");

        req.user = decoded;
        next();

    } catch (error) {
        console.log(error);

        return res.status(401).json({
            message: error.message
        });
    }
}



const User = require("../models/user");

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
        return res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = { authMiddleWare, adminMiddleware };