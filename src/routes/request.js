const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const requestRoutes = express.Router();


requestRoutes.post("/sendConnectionRequest",authMiddleware,(req,res)=>{
const user = req.user;
res.send({
    message : `Connection request sent by ${user?.firstName}`
})
})


module.exports = requestRoutes