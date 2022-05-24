"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class affiliate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  affiliate.init(
    {
      id: {
        type: DataTypes.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: DataTypes.STRING,
      link: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: DataTypes.STRING,
      pictures: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "affiliate",
    }
  );
  return affiliate;
};
