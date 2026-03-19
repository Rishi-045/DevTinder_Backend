const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cors = require("cors");
const http = require("http");
const cookieParser = require("cookie-parser")
require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
const authRoutes = require("./routes/auth")
const profileRoutes = require("./routes/profile")
const requestRoutes = require("./routes/request");
const userRoute = require("./routes/user");
const scheduleCronJob = require("./utils/cronJob");
const initializeSocket = require("./config/socket");
const chatRouter = require("./routes/chat");
app.use(cors({
  origin: [process.env.CLIENT_URL,
"https://dev-tinder-orcin.vercel.app"],
  credentials: true,
}))
app.use("/",authRoutes)
app.use("/",profileRoutes);
app.use("/",requestRoutes);
app.use("/",userRoute)
app.use("/",chatRouter)
// create http server
const server = http.createServer(app);

// attach soket.io
initializeSocket(server);


// schedule cron job
scheduleCronJob.start();



connectDB()
  .then(() => {
    console.log("Database Connection Established...");
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });
