const sequelize = require('../connect');
const Sequelize = require('sequelize');
const Ingredient = sequelize.define(
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
    timestamps: false
  }
);

module.exports = Ingredient;
