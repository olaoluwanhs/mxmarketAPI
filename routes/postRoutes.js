const { sequelize, users, listings } = require("../models");
const { use } = require("express/lib/application");
const { signUser, verifyUser } = require("./middleware/jwt");
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
      console.log(error);
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
      console.log(error);
      res.json({ message: "An error occured", error });
    }
  });
  //

  app.post("/categories", (req, res) => {});
  // Others...
}
module.exports = postRoutes;
