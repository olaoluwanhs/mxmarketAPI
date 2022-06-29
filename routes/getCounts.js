// Function containing all get routes
const { serialize } = require("cookie");
const bcrypt = require("bcrypt");
const { Op, where, QueryError, NUMBER } = require("sequelize");
const sign = require("jsonwebtoken/sign");
const {
  sequelize,
  users,
  listings,
  order,
  categories,
  affiliate,
  posts,
} = require("../models");
const { signUser, verifyUser } = require("./middleware/jwt");
const req = require("express/lib/request");
const res = require("express/lib/response");

function getCounts(app) {
  // get route to get a counts
  app.get("/listingCount", async (req, res) => {
    let totalCount = await listings.count();
    res.json(totalCount);
  });
  //
  app.get("/postCount", async (req, res) => {
    let totalCount = await posts.count();
    res.json(totalCount);
  });
  // Others...
}
module.exports = getCounts;
