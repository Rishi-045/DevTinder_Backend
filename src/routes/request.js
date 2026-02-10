const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRoutes = express.Router();

requestRoutes.post(
  "/request/send/:status/:toUserId",
  authMiddleware,
  async (req, res) => {
    try {
      const fromUserId = req?.user?._id;
      const toUserId = req?.params?.toUserId;
      const status = req?.params?.status;

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const ALLOWED_STATUS = ["interested", "ignored"];
      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({
          message: `Invalid status value : ${status}.`,
        });
      }

      const isUserExist = await User.findById(toUserId);
      if (!isUserExist) {
        return res.status(400).json({
          messsage: "User not found.",
        });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection request already exists.",
        });
      }

      const data = await connectionRequest.save();
      res.json({
        message:
          status == "ignored"
            ? "Request ignored successfully"
            : "Request sent successfully",
        data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
      });
    }
  },
);

requestRoutes.post(
  "/request/review/:status/:requestId",
  authMiddleware,
  async (req, res) => {
    try {
      const { user: loggedInUser } = req;
      const { status, requestId } = req.params;

      const ALLOWED_STATUS = ["accepted", "rejected"];
      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({
          message: `Invalid status value : ${status}.`,
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser?._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found.",
        });
      }

      connectionRequest.status = status;
      await connectionRequest.save();

      return res.json({
        message:
          status == "accepted"
            ? "Connection request accepted successfully"
            : "Connection request rejected successfully",
        data: connectionRequest,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
      });
    }
  },
);

module.exports = requestRoutes;
