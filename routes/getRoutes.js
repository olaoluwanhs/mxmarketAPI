// Function containing all get routes
const { serialize } = require("cookie");
const { Op } = require("sequelize");
const sign = require("jsonwebtoken/sign");
const { sequelize, users, listings } = require("../models");

function getRoutes(app, mysqlCon) {
  // get route to get a user
  app.get("/user", async ({ query }, res) => {
    try {
      const user = await users.findByPk(query.id);
      // console.log(user);
      res.json(user);
    } catch (error) {}
  });

  // Login route
  app.get("/login", async ({ query }, res) => {
    try {
      const user = await users.findOne({
        where: {
          [Op.or]: [
            { user_name: query.user_name || "" },
            { email: query.user_name || "" },
          ],
        },
        attributes: ["id", "user_name", "password", "email"],
      });
      // console.log(query);
      user != null
        ? (() => {
            if (
              query.password.replace(/ /g, "") ==
              user.password.replace(/ /g, "")
            ) {
              res.json({
                id: user.id,
                user_name: user.user_name,
                email: user.email,
              });
            } else {
              res.json({ message: "wrong password" });
            }
          })()
        : (() => {
            res.json({ message: "no user found" });
          })();
      // console.log(user);
    } catch (error) {}
  });

  //
  // get profile information
  app.get("/profile", async ({ query }, res) => {
    try {
      const user = await users.findOne({
        where: { user_name: query.user_name },
        attributes: { exclude: ["password"] },
      });
      // console.log(user);
      res.json(user);
    } catch (error) {
      console.log(error);
      res.json({ message: "Error occured", error: error });
    }
  });
  // get route to listings
  app.get("/listings", (req, res) => {
    let result = mysqlCon.query(query.getListing(req.params));
    res.json(result);
  });
  // Others...
}
module.exports = getRoutes;
