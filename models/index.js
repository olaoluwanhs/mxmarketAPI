// Creating connection to mongoDB server
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/mxmarketDB")
mongoose.connection.on("connected",()=>{
    console.log("connected to mongoDB server");
})
mongoose.connection.on("error",()=>{
    console.log("there was an error connecting to mongoDB server");
})
// 
//  Importing all models
let userModel = require("./models/UserModel");
// 
// Exporting models object
module.exports = {
    userModel
}; 