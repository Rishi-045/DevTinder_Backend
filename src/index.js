const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

//this is use to read environment variables
require("dotenv").config();

//this is the built-in middleware that parse the json into javascript object
app.use(express.json());

// get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find();
    if (user.length == 0) {
      return res.status(404).json({ message: "Users not found" });
    }

    return res.json({ data: user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//update user by id
app.patch("/user", async (req, res) => {
  try {
    const { userId } = req.body;
    const updatedData = await User.findByIdAndUpdate(userId, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!updatedData) {
      res.status(404).send("User not found.");
    } else {
      res.send({
        message: "User data updated Successfully",
        data: updatedData,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

//delete user by id
app.delete("/user", async (req, res) => {
  try {
    const { id } = req.query;
    const data = await User.findByIdAndDelete(id);
    if (!data) {
      res.status(404).send({
        message: "User not Found",
      });
    } else {
      res.send({
        message: "User deleted Successfully.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// get user by id
app.get("/user", async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ data: user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.post("/signup", async (req, res) => {
  try {
    //create a new instance of the User model
    const user = new User(req.body);
    const data = await user.save();
    console.log(data);
    res.send("User created successfully");
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
