const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type.`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

//compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function() {
  const connectionRequest = this;
  if (connectionRequest.toUserId.equals(connectionRequest.fromUserId)) {
    throw new Error("Cannot send connection request to yourself.");
  }
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);
module.exports = ConnectionRequest;
