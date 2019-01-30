const db = require("../db");
const Sequelize = require("sequelize");
const Ingredient = db.define(
  "ingredients",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false
  }
);

module.exports = Ingredient;
