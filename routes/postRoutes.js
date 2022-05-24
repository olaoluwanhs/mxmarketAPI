const {
  sequelize,
  users,
  listings,
  order,
  categories,
  affiliate,
  posts,
} = require("../models");
const { use } = require("express/lib/application");
const { signUser, verifyUser } = require("./middleware/jwt");
const res = require("express/lib/response");
//
function postRoutes(app) {
  // post route to Create new users
  app.post("/users", async ({ body }, res) => {
    if (body.password != body.confirm_password) {
      res.json({
        message: "Password unconfirmed",
      });
      return;
    }
    try {
      const user = await users.create(body);
      res.json(user);
    } catch (error) {
      console.log(error.message);
      res.json({
        message: "Error addding user",
        error: error,
      });
    }
  });
  //

  app.post("/listing", verifyUser, async ({ body, authenticatedUser }, res) => {
    try {
      //
      // console.log(body);
      body.author = authenticatedUser.id;
      let results = await listings.create(body);
      res.json(results);
      //
    } catch (error) {
      console.log(error.message);
      res.json({ message: "An error occured", error });
    }
  });
  //

  app.post("/order", verifyUser, async ({ body, authenticatedUser }, res) => {
    try {
      console.log(authenticatedUser.id);
      if (authenticatedUser.id == undefined) {
        return res.json({
          message: "not signed in",
        });
      }
      //find user and wallet amount
      const user = await users.findOne({
        where: {
          id: authenticatedUser.id,
        },
        attributes: {
          exclude: ["password"],
        },
      });
      // compare wallet amount to price
      if (user.wallet < body.price) {
        return res.json({ message: "wallet balance is too low" });
      }
      // create order
      const createdOrder = await order.create(body);
      // subtract price from wallet and update user wallet
      const userWalletUpdate = await user.update(
        {
          wallet: user.wallet - body.price,
        },
        {
          where: {
            id: authenticatedUser.id,
          },
          hooks: false,
        }
      );
      // return
      return res.json({
        message: "order successfull",
        createdOrder,
        userWalletUpdate,
      });
    } catch (error) {
      console.log(error.message);
      return res.json({ message: "An error occured" });
    }
  });
  //
  app.post(
    "/category",
    verifyUser,
    async ({ body, authenticatedUser }, res) => {
      try {
        //
        if (authenticatedUser.id == undefined) {
          return res.json({ message: "Unathorised User" });
        }
        //
        const admin = await users.findOne({
          where: {
            id: authenticatedUser.id,
            userType: "admin",
          },
        });
        //
        if (admin == null) {
          return res.json({ message: "Unathorised action" });
        }
        //
        const addedCategory = await categories.create({
          name: body.category_name,
          sub_category: body.sub_category,
        });
        //
        return res.json(addedCategory);
      } catch (error) {
        console.log(error.message);
        return res.json({ message: "An rror occured", error: error.message });
      }
    }
  );
  //
  app.post(
    "/affiliate",
    verifyUser,
    async ({ body, authenticatedUser }, res) => {
      try {
        //
        if (authenticatedUser.id == undefined) {
          return res.json({ message: "Unathorised User" });
        }
        //
        const admin = await users.findOne({
          where: {
            id: authenticatedUser.id,
            userType: "admin",
          },
        });
        //
        if (admin == null) {
          return res.json({ message: "Unathorised action" });
        }
        //
        const addedAffiliate = await affiliate.create({
          title: body.title,
          link: body.link,
          description: body.description,
          pictures: body.pictures,
        });
        //
        return res.json(addedAffiliate);
      } catch (error) {
        console.log(error.message);
        return res.json({ message: "An rror occured", error: error });
      }
    }
  );
  //
  app.post("/post", verifyUser, async ({ body, authenticatedUser }, res) => {
    try {
      if (authenticatedUser.id == undefined) {
        return res.json({ message: "Unathorised User" });
      }
      //
      const admin = await users.findOne({
        where: {
          id: authenticatedUser.id,
        },
      });
      //
      if (admin.userType != "admin" || admin.userType != "author") {
        return res.json({ message: "Unathorised action" });
      }
      //
      const posted = await posts.create(body);
      return res.json(posted);
      //
    } catch (error) {
      return res.json({ message: "An error occurred", error });
    }
  });
  // Others...
}
module.exports = postRoutes;
