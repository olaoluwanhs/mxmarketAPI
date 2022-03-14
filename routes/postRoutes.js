const query = require("./postQueries");
// console.log(query);
// Funcntion containing all Post routes routes
function postRoutes(app, mysqlCon) {
  // post route to Create new users
  app.post("/", ({ body }, res) => {
    try {
      // Check passwords
      if (body.password != body.confirm) {
        res.json({ message: "Password unconfirmed" });
        return;
      }
      //
      mysqlCon.query(query.createUser(body), (err, result) => {
        if (err) {
          console.log(error);
          res.json({ message: "Error addding user" });
        }
        res.json(result);
      });
    } catch (error) {
      //   console.log(error);
      res.json({ message: "Error addding user" });
    }
  });
  //
  app.post("/listing", (req, res) => {});
  //
  app.post("/categories", (req, res) => {});
  // Others...
}
module.exports = postRoutes;
