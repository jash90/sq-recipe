const Sequelize = require("sequelize");

const sequelize = new Sequelize("graves", "graves", "145TalentedLockets", {
  host: "89.40.119.116",
  dialect: "postgres",
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
