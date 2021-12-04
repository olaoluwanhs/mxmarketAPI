const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = 3000;
const getRoutes = require("./routes/getRoutes");
const postRoutes = require("./routes/postRoutes");
const models = require("./models/index");


// Body parsing middleware
app.use(express.urlencoded({extended:true}))
app.use(express.json());


// Initialise get routes
getRoutes(app, models);
postRoutes(app, models);

// Listen on port 3000
app.listen(port, ()=>{
    console.log(`server listening on port ${port}`);
})