const db = require("../db");
const Sequelize = require("sequelize");
const Recipe = db.define(
  "recipes",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(64),
      unique: true
    },
    content: {
      type: Sequelize.TEXT
    },
    preparationTime: {
      type: Sequelize.INTEGER
    },
  },
  {
    timestamps: false
  }
);
module.exports = Recipe;
