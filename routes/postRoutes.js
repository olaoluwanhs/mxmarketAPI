const { sequelize, users } = require("../models");
const { use } = require("express/lib/application");
//
function postRoutes(app) {
  // post route to Create new users
  app.post("/users", async ({ body }, res) => {
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

  app.post("/listings", ({ body }, res) => {
    //
    function getFinalBody(body) {
      //
      return body;
    }

    //
    let finalBody = getFinalBody(body);
    mysqlCon.query(query.createListing(body), (err, result) => {
      //
      if (err) {
        console.log(err);
        res.json(err);
        return;
      }
      //
      res.json(body);
    });
  });
  //

  app.post("/categories", (req, res) => {});
  // Others...
}
module.exports = postRoutes;
