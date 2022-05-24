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

function getRoutes(app, mysqlCon) {
  // get route to get a user
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
      console.log(error.message);
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
      console.log(error.message);
      res.json({
        message: "There was an error getting listings",
        error: error,
      });
    }
    //
  });
  //
  app.get("/order", verifyUser, async ({ query, authenticatedUser }, res) => {
    try {
      //
      if (authenticatedUser.id == undefined) {
        return res.json({ message: "Unauthorised action" });
      }
      // get order
      const gottenOrder = await order.findOne({
        where: {
          uuid: query.id,
        },
      });
      if (gottenOrder == null) {
        return res.json({ message: "There is order" });
      }
      // compare id to from and to
      if (
        authenticatedUser.id != gottenOrder.from &&
        authenticatedUser != gottenOrder.to
      ) {
        return res.json({
          message: "This order isn't yours",
        });
      }
      // return the order if passed
      return res.json(gottenOrder);
    } catch (error) {
      console.log(error.message);
      return res.json({ message: "an error occured" });
    }
  });
  //
  app.get("/orders", verifyUser, async ({ query, authenticatedUser }, res) => {
    try {
      //
      if (authenticatedUser.id == undefined) {
        return res.json({ message: "Unauthorised action" });
      }
      //
      let where =
        query.type == "from"
          ? { from: authenticatedUser.id }
          : { to: authenticatedUser.id };
      //
      const orderLists = await order.findAll({
        where: where,
        offset: Number(query.offset),
        limit: Number(query.limit),
      });
      //
      return res.json(orderLists);
    } catch (error) {
      console.log(error.message);
      return res.json({ message: "There was an error" });
    }
  });
  //
  app.get("/category", async ({ query }, res) => {
    //
    try {
      const where =
        query.category != undefined ? { where: { name: query.category } } : {};
      //
      const categoryList = await categories.findAll(where);
      //
      return res.json(categoryList);
    } catch (error) {
      console.log(error.message);
      return res.json({ message: error.message });
    }
  });
  //
  app.get("/affiliate", async ({ query }, res) => {
    //
    try {
      // You don't really need pagination because you won't let iot be too many.
      const affiliateProducts = await affiliate.findAll({
        limit: Number(query.limit) || undefined,
        offset: Number(query.offset) || 0,
      });
      return res.json(affiliateProducts);
      //
    } catch (error) {
      console.log(error.message);
      return res.json({
        message: "An error occured",
        error: error.message,
      });
    }
  });
  //
  app.get("/affiliateProduct", async ({ query }, res) => {
    //
    try {
      //
      const affiliateProducts = await affiliate.findOne({
        where: { id: query.id },
      });
      return res.json(affiliateProducts);
      //
    } catch (error) {
      console.log(error.message);
      return res.json({
        message: "An error occured",
        error: error.message,
      });
    }
  });
  //
  app.get("/post", async ({ query }, res) => {
    try {
      //
      const post = await posts.findOne({
        where: {
          slug: query.slug,
        },
      });
      return res.json(post);
      //
    } catch (error) {
      return res.json({ message: "An error occured", error });
    }
  });
  //
  app.get("/posts", async ({ query }, res) => {
    try {
      const postList = await posts.findAll({
        limit: Number(query.limit) || undefined,
        offset: Number(query.offset) || 0,
      });
      return res.json(postList);
      //
    } catch (error) {
      return res.json({
        message: "An error occured",
        error,
      });
    }
  });
  // Others...
}
module.exports = getRoutes;
