const express = require("express");
const profileRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  validateEditProfileData,
} = require("../utils/validation/validateEditProfileData");

profileRouter.get("/profile", authMiddleware, async (req, res) => {
  try {
    const { user } = req;
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

profileRouter.patch("/profile", authMiddleware, async (req, res) => {
  try {
    const isUpdateAllowed = validateEditProfileData(req);
    if (!isUpdateAllowed) {
      return res.status(400).json({
        message: "Invalid update fields",
      });
    }
    const { user } = req;

    Object.keys(req.body).map((field) => (user[field] = req.body[field]));
    const updatedUserData = await user.save();
    res.send({
      message: "Profile updated successfully",
      data: updatedUserData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

module.exports = profileRouter;
