const res = require("express/lib/response");
const {
  listings,
  users,
  categories,
  affiliate,
  posts,
} = require("../models/index");
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
        console.log(error.message);
        return res.json({ message: "An error occured" });
      }
    }
  );
  //
  app.delete(
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
        const deletedCategory = await categories.destroy({
          where: {
            name: body.category_name,
            sub_category: body.sub_category,
          },
        });
        //
        return res.json(deletedCategory);
      } catch (error) {
        console.log(error.message);
        return res.json({ message: "An error occured", error: error.message });
      }
    }
  );
  //
  app.delete(
    "/affiliate",
    verifyUser,
    async ({ query, authenticatedUser }, res) => {
      // confirm authenticated user is an admin

      if (authenticatedUser.id == undefined) {
        return res.json({ message: "Unauthorised action" });
      }
      const admin = await users.findOne({
        where: {
          id: authenticatedUser.id,
        },
      });
      if (admin.userType != "admin") {
        return res.json({
          message: "Unauthorised user",
          user: admin,
          authenticatedUser,
        });
      }
      // delete product
      const deleted = await affiliate.destroy({
        where: {
          id: query.id,
        },
      });
      //
      return res.json(deleted);
    }
  );
  //
  app.delete("/post", verifyUser, async ({ query, authenticatedUser }, res) => {
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
      console.log(admin.userType, "admin");
      if (admin.userType != "admin" && admin.userType != "author") {
        return res.json({ message: "Unathorised action" });
      }
      //
      const updatingPost = await posts.findOne({
        where: {
          id: query.id,
        },
      });
      if (updatingPost.author == undefined) {
        return res.json({ message: "The post doesn't exist anymore" });
      }
      //
      if (updatingPost.author != authenticatedUser.id) {
        return res.json({ message: "Unauthorised Action (not the author)" });
      }
      //
      const deleted = await posts.destroy({
        where: {
          id: query.id,
        },
      });
      //
      return res.json(deleted);
    } catch (error) {
      return res.json({ message: "An error occurred", error: error.message });
    }
  });
}

module.exports = { deleteRoutes };
