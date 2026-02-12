const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const ConnectionRequest = require("../models/connectionRequest");
const userRoute = express.Router();

const userFields = "firstName lastName email";

userRoute.get("/user/requests", authMiddleware, async (req, res) => {
  try {
    const { user: loggedInUser } = req;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser?._id,
      status: "interested",
    }).populate("fromUserId", userFields);
    console.log(connectionRequests);
    res.status(200).json({
      requests:
        connectionRequests.length == 0
          ? "No Connection Request"
          : connectionRequests,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error.",
      error: err.message,
    });
  }
});

userRoute.get("/user/connections", authMiddleware, async (req, res) => {
  try {
    const { user: loggedInUser } = req;
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser?._id }, { toUserId: loggedInUser?._id }],
      status: "accepted",
    })
      .populate("fromUserId", userFields)
      .populate("toUserId", userFields);

    const user = connections.map((conn) => {
      if (conn.fromUserId?._id.toString() === loggedInUser?._id.toString()) {
        return conn.toUserId;
      } else {
        return conn.fromUserId;
      }
    });

    return res.json({
      message:
        user.length === 0
          ? "No Connection"
          : "Connections Fetched Successfully.",
      connections: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error.",
      error: err.message,
    });
  }
});

module.exports = userRoute;
