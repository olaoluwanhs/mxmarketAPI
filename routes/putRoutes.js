const { sequelize, users, listings } = require("../models");
const { verifyUser } = require("./middleware/jwt");

function updateRoutes(app) {
  // update and edit users
  app.put("/user", verifyUser, (req, res) => {
    //
  });
  // Edit listings
  // Renew listing
  //
}
module.exports = updateRoutes;
