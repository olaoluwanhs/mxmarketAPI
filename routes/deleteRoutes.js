const { listings } = require("../models/index");
const { verifyUser } = require("./middleware/jwt");

function deleteRoutes(app) {
  //
  app.delete(
    "/listing",
    verifyUser,
    async ({ body, authenticatedUser }, res) => {
      try {
        if (authenticatedUser.id == undefined) {
          return res.json({ message: "Unauthorized action" });
        }
        const toBeDeleted = await listings.findOne({
          where: {
            id: body.id,
          },
          attributes: ["id", "author"],
        });
        if (toBeDeleted == null) {
          return res.json({ message: "object doesn't exist" });
        }
        //
        if (toBeDeleted.author != authenticatedUser.id) {
          return res.json({ message: "Unauthorized action" });
        }
        //
        const deleted = await listings.destroy({
          where: {
            id: body.id,
          },
        });
        return res.json({ message: "Deleted successfully", result: deleted });
      } catch (error) {
        console.log(error);
        return res.json({ message: "An error occured" });
      }
    }
  );
  //
}

module.exports = { deleteRoutes };
