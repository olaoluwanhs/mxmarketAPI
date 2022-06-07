"use strict";
const { Model, UUID } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  order.init(
    {
      uuid: {
        type: DataTypes.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "sent",
      },
      product: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "this-is-a-delivery-request-alone",
      }, //listing id
      product_name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Delivery Request",
      },
      from: { type: DataTypes.STRING, allowNull: false },
      to: { type: DataTypes.STRING, allowNull: false },
      price: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "order",
    }
  );
  return order;
};
