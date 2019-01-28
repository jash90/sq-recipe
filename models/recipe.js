const db = require('../db');
const Sequelize = require('sequelize');
const User = require("./user");
const Recipe = db.define(
  'recipe',
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
    idUser: {
      type: Sequelize.INTEGER
    }
  },
  {
    timestamps: false
  }
);
User.hasMany(Recipe, {foreignKey: 'idUser', sourceKey: 'id'});
Recipe.belongsTo(User, {foreignKey: 'idUser', targetKey: 'id'});
module.exports = Recipe;
