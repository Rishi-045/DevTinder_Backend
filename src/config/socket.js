const { Server } = require("socket.io");
const Chat = require("../models/messages");
const ConnectionRequest = require("../models/connectionRequest");

const onlineUsers = new Map();

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected : ", socket.id);

    const userId = socket.handshake.query.userId;
    console.log(userId);
    console.log(onlineUsers);
    //store online user
    if (userId) {
      onlineUsers.set(userId, socket.id);
    }

    // join chat room
    socket.on("joinChat", ({ currentUserId, toUserId }) => {
      const roomId = [currentUserId, toUserId].sort().join("_");
      socket.join(roomId);
      console.log("User Joined Chat : ", roomId);
    });

    // send Messages
    socket.on(
      "sendMessage",
      async ({ currentUserId, toUserId, message, image, senderName }) => {
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

          console.log("Online Users:", onlineUsers);
          console.log("Receiver socket:", onlineUsers.get(toUserId));

          // send notification
          const receiverSocketId = onlineUsers.get(toUserId);

          if (receiverSocketId) {
            io.to(receiverSocketId).emit("newNotification", {
              type: "MESSAGE",
              message: `${senderName} sent you a message`,
              fromUserId: currentUserId,
            });
          }
        } catch (err) {
          console.error("Error sending message: ", err);
        }
      },
    );

    socket.on("disconnect", () => {
      console.log("User Disconnected : ", socket.id);
      onlineUsers.delete(userId);
    });
  });
}

module.exports = initializeSocket;
