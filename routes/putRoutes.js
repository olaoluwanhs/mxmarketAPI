const res = require("express/lib/response");
const { DATE } = require("mysql/lib/protocol/constants/types");
const {
  sequelize,
  users,
  listings,
  order,
  affiliate,
  posts,
} = require("../models");
const { verifyUser, signUser } = require("./middleware/jwt");

function updateRoutes(app) {
  // update and edit users
  app.put("/user", verifyUser, async ({ body, authenticatedUser }, res) => {
    try {
      //
      console.log(authenticatedUser);
      if (
        authenticatedUser.id == undefined
        // authenticatedUser.email != body.update.email
      ) {
        return res.json({ message: "unauthorized action" });
      }
      //prevents update of email
      body.update.email = undefined;
      // check password allowance
      body.passwordChange != "allowed"
        ? (() => {
            body.update.password = undefined;
          })()
        : (() => {})();
      //
      const result = await users.update(body.update, {
        where: {
          id: authenticatedUser.id,
        },
      });
      // Sign new cookie
      const updatedUser = await users.findOne({
        where: {
          id: result[0],
        },
        attributes: { exclude: ["password"] },
      });
      const jwtUser = {
        id: updatedUser.id,
        user_name: updatedUser.user_name,
        email: updatedUser.email,
      };
      //   console.log(jwtUser);
      res.cookie("mxcookie", signUser(jwtUser, process.env.SECRET), {
        httpOnly: true,
      });
      return res.json(updatedUser);
      //
    } catch (error) {
      console.log(error);
      res.json({
        message: "An error occured",
        error: error.message,
      });
    }
  });
  // Edit listings
  app.put("/listing", verifyUser, async ({ body, authenticatedUser }, res) => {
    // confirm that user owns the listing
    if (authenticatedUser.id != body.author) {
      return res.json({ message: "unauthorised action for you" });
    }
    // owner of listing canot be changed
    body.author = undefined;
    // update listing
    const updated = await listings.update(body, {
      where: { id: body.id },
      individualHooks: true,
    });
    return res.json(updated);
    // return the new listing
  });
  // Renew listing
  app.put("/renew", verifyUser, async ({ body, authenticatedUser }, res) => {
    // get the listing from database to see if it still exists
    const listing = await listings.findOne({
      where: {
        id: body.id,
        author: authenticatedUser.id,
      },
    });
    // Check that listing exists
    if (listing == null) {
      return res.json({ message: "Listing doesn't exist anymore" });
    }
    if (listing.author != authenticatedUser.id) {
      // check if owner is authorised user
      return res.json({ message: "unauthorised action" });
    }
    // check to see its state
    // check its expiry date
    if (listing.state != "expired" && new Date() < new Date(listing.expiry)) {
      return res.json({ message: "listing isn't expired yet" });
    }
    // update its expiry date and state
    const renewed = await listings.update(
      { state: "published" },
      {
        where: {
          id: listing.id,
          author: authenticatedUser.id,
        },
      }
    );
    if (renewed == null) {
      return res.json({ message: "updating error occured" });
    }
    // return updated
    return res.json(renewed);
  });
  //
  // update order to sent, delivered
  app.put("/deliever", verifyUser, async ({ body, authenticatedUser }, res) => {
    //
    // confirm authenticated user
    if (authenticatedUser == {}) {
      return res.json({ message: "Unauthorised action" });
    }
    // get object to be updated
    const toBeUpdatedOrder = await order.findOne({
      where: {
        uuid: body.uuid,
      },
    });
    // check that authenticated user is either the from or to
    if (authenticatedUser.id != toBeUpdatedOrder.to) {
      console.log(toBeUpdatedOrder.to, authenticatedUser.id);
      return res.json({ message: "Unauthorized action" });
    }
    // check operation from or to is trying to perform
    // edit order and then update
    const updateSuccesfully = await order.update(
      { state: body.action },
      {
        where: {
          uuid: body.uuid,
        },
      }
    );
    // return updated successfully
    return res.json({
      message: "successfully update",
      result: updateSuccesfully,
    });
    //
  });
  //
  app.put(
    "/affiliate",
    verifyUser,
    async ({ body, authenticatedUser }, res) => {
      try {
        // confirm authenticated user is an admin
        if (authenticatedUser.id == undefined) {
          return res.json({ message: "Unauthorised action" });
        }
        const admin = await users.findOne({
          where: {
            id: authenticatedUser.id,
          },
        });
        //
        if (admin.userType != "admin") {
          return res.json({ message: "Unauthorised action" });
        }
        // updated the affiliate product
        const updated = await affiliate.update(body, {
          where: {
            id: body.id,
          },
        });

        // return the result
        return res.json(updated);
      } catch (error) {
        return {
          message: "An error occured",
          error: error.message,
        };
      }
    }
  );
  //
  app.put("/post", verifyUser, async ({ body, authenticatedUser }, res) => {
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
          id: body.id,
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
      const updated = posts.update(body, {
        where: {
          id: body.id,
        },
      });
      //
      return res.json({ message: "Successfull", updated });
    } catch (error) {
      return res.json({ message: "An error occured", error });
    }
  });
}
module.exports = updateRoutes;
