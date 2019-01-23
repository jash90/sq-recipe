const db = require('../db');
const Sequelize = require('sequelize');
const Ingredient = db.define(
  'ingredient',
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
    timestamps: false,
    tableName: 'ingredient'
  }
);

module.exports = Ingredient;
