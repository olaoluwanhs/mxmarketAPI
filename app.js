const getRoutes = require("./routes/getRoutes");
const postRoutes = require("./routes/postRoutes");
const { sign } = require("jsonwebtoken"),
  { serialize } = require("cookie"),
  express = require("express"),
  cors = require("cors"),
  app = express(),
  port = 4000,
  { sequelize, syncStuff } = require("./models/index");
require("dotenv").config();

// Body parsing middleware
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//
getRoutes(app);
postRoutes(app);
syncStuff();

// Listen on port 3000
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
