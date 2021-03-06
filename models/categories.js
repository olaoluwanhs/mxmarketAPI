"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  categories.init(
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      sub_category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Others",
      },
      image: {
        type: DataTypes.STRING,
        defaultValue: "./images/category.jpg",
      },
    },
    {
      sequelize,
      modelName: "categories",
    }
  );
  return categories;
};
