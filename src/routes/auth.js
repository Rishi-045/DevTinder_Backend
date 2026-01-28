const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt")

const authRoutes = express.Router();

authRoutes.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const data = await user.save();
    res.send("User created successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});


authRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    //check in the db user exist or not
    const isUserExist = await User.findOne({ email: email });
    if (!isUserExist) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }
    const isPasswordValid = await isUserExist.verifyPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }
    const token = await isUserExist.verifyJwt()
    res.cookie("token", token,{expires: new Date(Date.now() + 24 * 60 * 60 * 1000),httpOnly: true});
    return res.status(200).json({
      message: "Logged in successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});


authRoutes.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true });
    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

module.exports = authRoutes;
