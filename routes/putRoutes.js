const res = require("express/lib/response");
const { DATE } = require("mysql/lib/protocol/constants/types");
const { sequelize, users, listings } = require("../models");
const { isMoreThan30DaysAgo } = require("./middleware/day");
const { verifyUser, signUser } = require("./middleware/jwt");

function updateRoutes(app) {
  // update and edit users
  app.put("/user", verifyUser, async ({ body, authenticatedUser }, res) => {
    try {
      //
      //   console.log(authenticatedUser);
      if (
        authenticatedUser.id == undefined ||
        authenticatedUser.email != body.update.email
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
      res.json({
        message: "An error occured",
        error,
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
}
module.exports = updateRoutes;
