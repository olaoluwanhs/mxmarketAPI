"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class listings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  listings.init(
    {
      id: {
        type: DataTypes.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      category: DataTypes.STRING,
      sub_category: DataTypes.STRING,
      title: {
        type: DataTypes.STRING,
        validate: {
          len: {
            msg: "Title Should be between 5 and 30 characters",
            args: [5, 60],
          },
        },
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price_type: {
        type: DataTypes.STRING,
      },
      price: DataTypes.INTEGER,
      description: DataTypes.STRING,
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "published",
      },
      images: {
        type: DataTypes.STRING,
      },
      expiry: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP()"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "listings",
      hooks: {
        beforeSave: (user) => {
          user.slug = `${user.title.replace(/ /g, "-")}-${user.id}`;
        },
        afterSave: async (user) => {
          //
          await sequelize.query(
            `UPDATE listings SET expiry=DATE_ADD(CURDATE(),INTERVAL 10 DAY) WHERE id='${user.id}';`
          );
        },
      },
    }
  );
  return listings;
};
