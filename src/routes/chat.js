const express = require("express");
const chatRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Chat = require("../models/messages");

chatRouter.get("/chat/:toUserId", authMiddleware, async (req, res) => {
  try {
    const { toUserId } = req.params;
    console.log("To User ID : ", toUserId);
    const currentUserId = req.user._id;

    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, toUserId] },
    }).populate("messages.senderId", "firstName lastName photoUrl");
    if (!chat) {
      chat = new Chat({
        participants: [currentUserId, toUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.error("Error fetching chat: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = chatRouter;
