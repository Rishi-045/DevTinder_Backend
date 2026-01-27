const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const authMiddleware = require("./middlewares/authMiddleware")
require("dotenv").config();
app.use(express.json());
app.use(cookieParser());


app.post("/signup", async (req, res) => {
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

app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const {user} = req;
    return res.send({
      data: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

app.post("/login", async (req, res) => {
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
    const { password: encryptedPassword } = isUserExist;
    const isPasswordValid = await bcrypt.compare(password, encryptedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }
    const token = jwt.sign({ id: isUserExist._id }, process.env.SIGNATURE,{expiresIn: "1d"});
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

connectDB()
  .then(() => {
    console.log("Database Connection Established...");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });
