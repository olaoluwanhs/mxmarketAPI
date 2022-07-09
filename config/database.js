const Sequelize = require("sequelize");
const sequelize = new Sequelize("mxmarket", "root", "", {
  host: "localhost",
  dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
  logging: false,
});

//
let testDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
module.exports = { testDB, sequelize };
