const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;
const getRoutes = require("./routes/getRoutes");
const postRoutes = require("./routes/postRoutes");
const mysql = require("mysql");


// Body parsing middleware
app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use(express.json());
const mysqlCon = mysql.createConnection({
    host:"localhost",
    database:"mxmarket",
    user:"root",
    password:""
})
// console.log(cors())


// Initialise get routes
getRoutes(app, mysqlCon);
postRoutes(app, mysqlCon);

// Listen on port 3000
app.listen(port, ()=>{
    console.log(`server listening on port ${port}`);
})