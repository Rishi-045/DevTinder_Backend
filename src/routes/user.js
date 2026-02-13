const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRoute = express.Router();

const userFields = "firstName lastName email age gender skills about";

userRoute.get("/user/requests", authMiddleware, async (req, res) => {
  try {
    const { user: loggedInUser } = req;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser?._id,
      status: "interested",
    }).populate("fromUserId", userFields);

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

userRoute.get("/feed", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    let skip = (page - 1) * limit;
    const { user: loggedInUser } = req;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    const hideUserFromFeed = new Set();
    connectionRequests.forEach((conn) => {
      hideUserFromFeed.add(conn.fromUserId._id.toString());
      hideUserFromFeed.add(conn.toUserId._id.toString());
    });

    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(userFields)
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    });

    res.json({
      feed: feedUsers,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

module.exports = userRoute;
