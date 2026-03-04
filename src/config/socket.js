const { Server } = require("socket.io");
const Chat = require("../models/messages");
const ConnectionRequest = require("../models/connectionRequest");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected : ", socket.id);

    socket.on("joinChat", ({ currentUserId, toUserId }) => {
      const roomId = [currentUserId, toUserId].sort().join("_");
      socket.join(roomId);
      console.log("User Joined Chat : ", roomId);
    });

    socket.on(
      "sendMessage",
      async ({ currentUserId, toUserId, message, image }) => {
        try {
          const roomId = [currentUserId, toUserId].sort().join("_");

          // check if currentUserId and toUserId are friends or not
          const isValidConnection = await ConnectionRequest.findOne({
            $or: [
              {
                fromUserId: currentUserId,
                toUserId: toUserId,
                status: "accepted",
              },
              {
                fromUserId: toUserId,
                toUserId: currentUserId,
                status: "accepted",
              },
            ],
          });

          if (!isValidConnection) {
            console.log("Users are not connected. Message not sent.");
            return;
          }

          let chat = await Chat.findOne({
            participants: { $all: [currentUserId, toUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [currentUserId, toUserId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: currentUserId,
            text: message,
          });
          await chat.save();
          io.to(roomId).emit("messageReceived", {
            senderId: currentUserId,
            message,
            image,
          });
        } catch (err) {
          console.error("Error sending message: ", err);
        }
      },
    );

    socket.on("disconnected", () => {
      console.log("User Disconnected : ", socket.id);
    });
  });
}

module.exports = initializeSocket;
