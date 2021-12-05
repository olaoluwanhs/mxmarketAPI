const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema({
    firstName: String,
    LastName: String,
    userName: String,
    email: String,
    password:String,
    location:String,
    phoneNumber: Number,
    whatsApp: Number,
    store: Array
});

let userModel = mongoose.model("User", User);

module.exports = userModel;