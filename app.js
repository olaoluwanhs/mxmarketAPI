const getRoutes = require("./routes/getRoutes");
const postRoutes = require("./routes/postRoutes");
const updateRoutes = require("./routes/putRoutes");
const cookieParser = require("cookie-parser");
const { expireListing, deleteListing } = require("./regulation/regulate");
const { deleteRoutes } = require("./routes/deleteRoutes");
const getCounts = require("./routes/getCounts");
// const ejs = require("ejs");
const { sign } = require("jsonwebtoken"),
  { serialize } = require("cookie"),
  express = require("express"),
  cors = require("cors"),
  app = express(),
  port = process.env.PORT || 4000,
  { sequelize, syncStuff } = require("./models/index");
require("dotenv").config();

// Body parsing middleware
app.use(
  cors({
    credentials: true,
    origin: ["http://mxmarket.com.ng/", "https://mxmarket.com.ng"],
  })
);
// app.use(cors({ credentials: true, origin: "http://mxmarket.com.ng/" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("./public"));
//
app.set("view engine", "ejs");
//
// Creating and altering databaase tables
app.get("/mysql", async (req, res) => {
  try {
    await syncStuff();
    return res.json("done creating/ altering");
  } catch (error) {
    res.json(error.message);
  }
});
//
getRoutes(app);
postRoutes(app);
updateRoutes(app);
deleteRoutes(app);
getCounts(app);
let expireListingInterval = setInterval(() => {
  expireListing();
  deleteListing();
}, 12 * 60 * 60 * 1000);
//
// Listen on port 3000
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
