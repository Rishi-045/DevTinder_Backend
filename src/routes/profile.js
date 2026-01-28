const express = require("express");
const profileRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware")


profileRouter.get("/profile", authMiddleware, async (req, res) => {
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


module.exports = profileRouter;