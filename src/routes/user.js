const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const ConnectionRequest = require("../models/connectionRequest");
const userRoute = express.Router();

userRoute.get("/user/requests",authMiddleware, async(req,res)=>{
    try{

        const {user : loggedInUser} = req;
        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser?._id,
            status : "interested"
        })
        console.log(connectionRequests)
        res.status(200).json({
           requests :  connectionRequests.length == 0 ? "No Connection Request" : connectionRequests
        })

    }catch(err){
        return res.status(500).json({
            message : "Internal Server Error.",
            error : err.message
        })
    }
    // take the login user id 
    //  filter loggedin user connection requestion with status interesed in connection request;
})

module.exports = userRoute;