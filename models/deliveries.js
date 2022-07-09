"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class deliveries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  deliveries.init(
    {
      id: {
        type: DataTypes.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: { msg: "One or more required field is empty", args: [1] },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: { msg: "One or more required field is empty", args: [1] },
        },
      },
      s_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: { msg: "One or more required field is empty", args: [1] },
        },
      },
      s_address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: { msg: "One or more required field is empty", args: [1] },
        },
      },
      s_phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: { msg: "One or more required field is empty", args: [1] },
        },
      },
      s_email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: { msg: "One or more required field is empty", args: [1] },
        },
      },
      r_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: { msg: "One or more required field is empty", args: [1] },
        },
      },
      r_address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: { msg: "One or more required field is empty", args: [1] },
        },
      },
      r_phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: { msg: "One or more required field is empty", args: [1] },
        },
      },
      r_email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: { msg: "One or more required field is empty", args: [1] },
        },
      },
      state: {
        type: DataTypes.STRING,
        defaultValue: "sent",
        allowNull: false,
        validate: {
          len: { msg: "One or more required field is empty", args: [1] },
        },
      },
    },
    {
      sequelize,
      modelName: "deliveries",
    }
  );
  return deliveries;
};
