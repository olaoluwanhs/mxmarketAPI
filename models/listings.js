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
      title: DataTypes.STRING,
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: sequelize.col("id"),
      },
      author: DataTypes.INTEGER,
      price_type: DataTypes.STRING,
      price: DataTypes.INTEGER,
      description: DataTypes.STRING,
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "published",
      },
    },
    {
      sequelize,
      modelName: "listings",
      hooks: {
        beforeSave: (user) => {
          // console.log(user.id);
          user.slug = `${user.title.replace(/ /g, "-")}-${user.id}`;
          // console.log();
        },
      },
    }
  );
  return listings;
};
