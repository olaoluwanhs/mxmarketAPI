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
  deliveries,
} = require("../models");
const { signUser, verifyUser } = require("./middleware/jwt");
const res = require("express/lib/response");

function getRoutes(app) {
  // get route to get a user
  app.get(
    "/checkUser",
    verifyUser,
    async ({ authenticatedUser, cookies }, res) => {
      return res.json(authenticatedUser);
    }
  );
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
        attributes: ["id", "user_name", "password", "email", "userType"],
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
                userType: user.userType,
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
    } catch (error) {
      return res.json({ message: "An error occured", error: error.message });
    }
  });

  //
  app.get("/logout", async (req, res) => {
    try {
      //
      res.cookie("mxcookie", "", {
        httpOnly: true,
        maxAge: 1,
      });
      res.json({ message: "logged Out" });
    } catch (error) {
      console.log(error.message);
    }
  });
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
      res.json({ message: "Error occured", error: error.message });
    }
  });
  app.get(
    "/userListings",
    verifyUser,
    async ({ query, authenticatedUser }, res) => {
      //
      try {
        //
        const { user } = query;
        const result = await listings.findAll({
          where: {
            author: user,
          },
        });
        return res.json({
          message: (() => {
            if (authenticatedUser.user_name == user) {
              // console.log(authenticatedUser.user_name, user);
              return "user-owns-listings";
            }
            console.log(authenticatedUser, user);
            return "user-does-not-own-listings";
          })(),
          result,
        });
        //
      } catch (error) {
        console.log(error.message);
        return res.json({
          message: "An error occured",
          error: error.message,
        });
      }
    }
  );

  // get route to listings
  app.get("/listings", async ({ query }, res) => {
    //
    const { start, limit } = query;
    try {
      let result = await listings.findAll({
        where: { state: "published" },
        offset: Number(start) || 0,
        limit: Number(limit) || undefined,
        order: [["updatedAt", "DESC"]],
      });
      // console.log(result.length);
      return res.json(result);
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
  app.get("/listing", verifyUser, async ({ query, authenticatedUser }, res) => {
    //
    try {
      //
      const object = await listings.findOne({
        where: {
          slug: query.slug,
        },
      });
      if (object == null) {
        return res.status(404).json({ message: "Listing not found" });
      }
      //
      const owner =
        authenticatedUser.id == object.author ? "this-user" : "not-this-user";
      //
      return res.json({ message: owner, result: object });
      //
    } catch (error) {
      return res.status(409).json({
        message: "An error occured",
        error: error.message,
      });
    }
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
      // compare user_name to from and to
      if (
        authenticatedUser.user_name != gottenOrder.from &&
        authenticatedUser.user_name != gottenOrder.to
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
          ? { from: authenticatedUser.user_name }
          : { to: authenticatedUser.user_name };
      //
      const orderLists = await order.findAll({
        where: where,
        offset: Number(query.offset) || 0,
        limit: Number(query.limit) || undefined,
        order: [["updatedAt", "DESC"]],
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
        order: [["updatedAt", "DESC"]],
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
  app.get("/delivery", async ({ query }, res) => {
    //
    try {
      //
      const delivery = await deliveries.findOne({
        where: {
          id: query.id,
        },
      });
      return res.json(delivery);
      //
    } catch (error) {
      return res.json({ message: "An error occured", error: error.message });
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
        offset: Number(query.offset) || 0,
        limit: Number(query.limit) || undefined,
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
  //
  app.get("/searchPost", async ({ query }, res) => {
    try {
      const postList = await posts.findAll({
        where: {
          title: { [Op.like]: `%${query.term}%` },
        },
        offset: Number(query.offset) || 0,
        limit: Number(query.limit) || undefined,
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
  //
  app.get("/search", async ({ query }, res) => {
    try {
      console.log(query);
      const results = await listings.findAll({
        where: {
          category: { [Op.like]: `%${query.category || ""}%` },
          sub_category: { [Op.like]: `%${query.subcategory || ""}%` },
          [Op.and]: [
            {
              [Op.or]: {
                [Op.and]: {
                  price: { [Op.gt]: query.min || 0 },
                  price: { [Op.lt]: query.max || 1000000 },
                },
                price_type: "on-call",
              },
            },
            {
              [Op.or]: {
                title: { [Op.like]: `%${query.term || ""}%` },
                description: { [Op.like]: `%${query.term || ""}%` },
              },
            },
          ],
        },
        limit: 20,
        offset: query.offset || 0,
      });
      //
      // console.log(results);
      return res.json(results);
    } catch (error) {
      console.log(error.message);
      return res.json({ message: "An error occured", error: error.message });
    }
  });
  // Others...
  app.get("/images", verifyUser, async (req, res) => {
    const fs = require("fs");
    try {
      // console.log(req.authenticatedUser);
      if (req.authenticatedUser.userType != "admin") {
        return res.json({ message: "Unauthorized action" });
      }
      //
      const images = fs.readdirSync(__dirname + "/../public/adminImages/");
      // console.log(images);

      res.render("pages/images", { images: images });
    } catch (error) {
      console.log(error.message);
      res.render(error);
    }
  });

  //
  app.get("/reviews", (req, res) => {
    //
    res.render("pages/reviews");
  });
}
module.exports = getRoutes;
