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



module.exports = { authMiddleWare }