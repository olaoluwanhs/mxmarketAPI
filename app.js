const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = 3000;
const getRoutes = require("./routes/getRoutes");
const postRoutes = require("./routes/postRoutes");
const models = require("./models/index");
console.log(models)


// Initialise get routes
getRoutes(app);
postRoutes(app);




app.listen(port, ()=>{
    console.log(`server listening on port ${port}`);
})