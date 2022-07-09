const res = require("express/lib/response");
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
const { ImageUpload } = require("./middleware/images");
const { signUser, verifyUser } = require("./middleware/jwt");
//
function postRoutes(app) {
  // post route to Create new users
  app.post("/users", async ({ body }, res) => {
    if (body.password != body.confirm_password) {
      return res.status(409).json({
        message: "Password unconfirmed",
        error: { message: "password not confirmed" },
      });
      return;
    }
    try {
      const user = await users.create(body);
      res.json(user);
    } catch (error) {
      // console.log(error.message);
      res.status(409).json({
        message: "Error addding user",
        error: error,
      });
    }
  });
  //
  app.post("/delivery", async ({ body }, res) => {
    try {
      //
      const result = await deliveries.create(body);
      return res.json(result);
      //
    } catch (error) {
      return res.json({ message: "An error occured", error: error });
    }
  });
  //
  app.post("/listing", verifyUser, async ({ body, authenticatedUser }, res) => {
    try {
      //
      console.log(authenticatedUser);
      const user = await users.findOne({
        where: {
          id: authenticatedUser.id,
        },
      });
      if (user == null) {
        return res.status(409).json({
          message: "User not logged in",
        });
      }
      // console.log(body);
      body.author = authenticatedUser.user_name;
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
      // console.log(authenticatedUser.id);
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
        console.log(authenticatedUser);
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
          price: body.price,
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
    console.log(body);
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
      // console.log(admin);
      //
      if (admin.userType != "admin" && admin.userType != "author") {
        return res.json({ message: "Unathorised action" });
      }
      //
      // console.log(body);
      const posted = await posts.create(body);
      return res.json(posted);
      //
    } catch (error) {
      return res.json({ message: "An error occurred", error });
    }
  });
  //
  app.post("/search", async ({ body }, res) => {
    //
    try {
      //
      const result = await listings.findAll(body);
      return res.json(result);
      //
    } catch (error) {
      return res.json({ message: "An error occured", error: error.message });
    }
  });
  //

  // Image uploads
  app.post("/image", (req, res) => {
    try {
      ImageUpload.single(req, res, (err) => {
        if (err) {
          return res.json({ message: "error Uploading files", error: err });
        }
        //
        // console.log(req.file);
        return res.send({
          message: "Upload successful",
          name: `http://localhost:4000/uploads/${req.file.filename}`,
        });
      });
    } catch (error) {
      console.log(error.message);
      return res.json({
        message: "Error uploading images",
        error: error,
      });
    }
  });
  //
  app.post("/images", (req, res) => {
    try {
      ImageUpload.multiple(req, res, (err) => {
        if (err) {
          return res.json({ message: "error Uploading files", error: err });
        }
        //
        const images = req.files.map((ele) => {
          return ele.filename;
        });
        // console.log(images);
        //
        return res.json({
          message: "Upload succesfull",
          names: JSON.stringify(images),
        });
      });
    } catch (error) {
      console.log(error.message);
      return res.json(error);
    }
  });
  //
  app.post("/adminImages", verifyUser, async (req, res) => {
    try {
      if (req.authenticatedUser.userType != "admin") {
        return res.json({ message: "Unauthorized action" });
      }
      // console.log(req.files);
      ImageUpload.adminUploads(req, res, (err) => {
        if (err) {
          return res.json({ message: "error Uploading files", error: err });
        }
        //
        const images = req.files.map((ele) => {
          return ele.filename;
        });
        // console.log(images);
        //
        res.redirect("http://localhost:4000/images");
      });
    } catch (error) {
      console.log(error.message);
      res.redirect("http://localhost:4000/images");
    }
  });
  // Others...
  // This is temporary
  app.post("/reviews", async (req, res) => {
    try {
      const fs = require("fs");
      const html = `<div><h1>${req.body.name || "John Doe"}</h1><h4>${
        req.ip
      }</h4><p>${req.body.content}</p></div>`;
      // console.log();
      fs.appendFile(__dirname + "/../views/pages/reviews.ejs", html, () => {
        // console.log("done");
        res.json({ message: "success" });
      });
    } catch (error) {
      return res.json({ message: "An error occured", error: error.message });
    }
  });
}
module.exports = postRoutes;
