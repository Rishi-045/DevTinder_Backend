const express = require("express")
const app = express()
const PORT = 8000


  
app.use("/hello/world",(req, res, next) => {
    res.send("Request received  hello world");           
});
app.use("/hello",(req, res, next) => {
   
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})