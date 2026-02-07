const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser")
require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
const authRoutes = require("./routes/auth")
const profileRoutes = require("./routes/profile")
const requestRoutes = require("./routes/request")

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))
app.use("/",authRoutes)
app.use("/",profileRoutes);
app.use("/",requestRoutes);

connectDB()
  .then(() => {
    console.log("Database Connection Established...");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });
