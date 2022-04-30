// Function containing all get routes
const { serialize } = require("cookie");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const sign = require("jsonwebtoken/sign");
const { sequelize, users, listings } = require("../models");
const { signUser, verifyUser } = require("./middleware/jwt");
const req = require("express/lib/request");

function getRoutes(app, mysqlCon) {
  // get route to get a user
  // app.get("/user", async ({ query }, res) => {
  //   try {
  //     const user = await users.findByPk(query.id);
  //     // console.log(user);
  //     res.json(user);
  //   } catch (error) {}
  // });

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
        ? (async () => {
            // console.log(user.password, query.password);
            let passCheck = await bcrypt.compare(query.password, user.password);
            if (passCheck) {
              let jwtUser = {
                id: user.id,
                user_name: user.user_name,
                email: user.email,
              };
              res.cookie("mxcookie", signUser(jwtUser, process.env.SECRET), {
                httpOnly: true,
              });
              res.json(jwtUser);
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
  app.get("/profile", verifyUser, async ({ query, authenticatedUser }, res) => {
    try {
      const user = await users.findOne({
        where: { user_name: query.user_name },
        attributes: { exclude: ["password"] },
      });
      // console.log(authenticatedUser);

      res.json(
        (() => {
          if (
            authenticatedUser.id == user.id &&
            authenticatedUser.user_name == user.user_name &&
            authenticatedUser.email == user.email
          ) {
            return {
              message: "request-owns-profile",
              profile: user,
            };
          }
          return {
            message: "request-does-not-own-profile",
            profile: user,
          };
        })()
      );
    } catch (error) {
      console.log(error);
      res.json({ message: "Error occured", error: error });
    }
  });

  // get route to listings
  app.get("/listings", async ({ query }, res) => {
    //
    const { start, limit } = query;
    try {
      const result = await listings.findAll({
        where: { state: "published" },
        offset: Number(start),
        limit: Number(limit),
        order: [["updatedAt", "DESC"]],
      });
      res.json(result);
    } catch (error) {
      console.log(error);
      res.json({
        message: "There was an error getting listings",
        error: error,
      });
    }
    //
  });
  // Others...
}
module.exports = getRoutes;
