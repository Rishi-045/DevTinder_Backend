const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    process.env.CONNECTION_URL
  );
};

module.exports = connectDB;
