const User = require("../models/user");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        message: "Authentication token is missing",
      });
    }
    const istokenValid = validator.isJWT(token);
    if (!istokenValid) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
    const decodedData = jwt.verify(token, process.env.SIGNATURE);
    const user = await User.findById(decodedData.id);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = authMiddleware;
