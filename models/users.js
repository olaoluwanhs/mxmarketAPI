"use strict";
const bcrypt = require("bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init(
    {
      first_name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: false,
        },
      },
      last_name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: false,
        },
      },
      user_name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: "column",
        validate: {
          notEmpty: false,
        },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: false,
        },
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: "column",
        validate: {
          notEmpty: false,
        },
      },
      phone_number: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: "column",
        validate: {
          notEmpty: false,
        },
      },
      whatsapp: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: "column",
        validate: {
          notEmpty: false,
        },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: false,
        },
      },
      image: {
        type: DataTypes.STRING,
        unique: "column",
        allowNull: true,
      },
      wallet: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      userType: {
        type: DataTypes.STRING,
        defaultValue: "user",
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "users",
      hooks: {
        beforeSave: async (user) => {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(user.password, salt);
          user.password = hash;
        },
      },
    }
  );
  return users;
};
