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
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            msg: "Title must be longer than 5 characters",
            args: [5],
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      link: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          len: {
            msg: "Link is empty",
            args: [3],
          },
        },
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
