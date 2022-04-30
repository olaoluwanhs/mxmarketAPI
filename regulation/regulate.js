// Regulate the number of listings
const { Op } = require("sequelize");
const { listings, sequelize } = require("../models/index");

async function expireListing() {
  const oldListings = await listings.findAll({
    where: {
      expiry: {
        [Op.lt]: sequelize.literal("NOW()"),
      },
    },
  });
  if (oldListings.length < 1) {
    return;
  }
  const objInfoList = oldListings.map(({ id }) => {
    return id;
  });
  // update all to expired
  const updatedObj = await listings.update(
    { state: "expired" },
    {
      where: {
        id: objInfoList,
      },
    }
  );
  // send email
  // sendEmailFunction();
}
//
async function deleteListing() {
  const oldListings = await listings.findAll({
    where: sequelize.literal(
      "DATE(NOW()) > DATE(`listings`.`expiry` + INTERVAL 3 DAY)"
    ),
  });
  if (oldListings.length < 1) {
    return;
  }
  const objInfoList = oldListings.map(({ id }) => {
    return id;
  });
  // update all to expired
  const updatedObj = await listings.destroy({
    where: {
      id: objInfoList,
    },
  });
  // send email
  // sendEmailFunction();
}

module.exports = { expireListing, deleteListing };
