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
        defaultValue: sequelize.UUIDV4,
      },
      products: DataTypes.STRING,
      from: DataTypes.INTEGER,
      to: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "order",
    }
  );
  return order;
};
