const mongoose = require("mongoose"),
mysql = require("mysql"),
{sign} = require('jsonwebtoken'),
{serialize} = require('cookie');
 express = require("express"),
 cors = require("cors"),
 app = express(),
 port = 4000,
 getRoutes = require("./routes/getRoutes"),
 postRoutes = require("./routes/postRoutes"),
require('dotenv').config();


// Body parsing middleware
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
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