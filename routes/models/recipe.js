const sequelize = require('../connect');
const Sequelize = require('sequelize');
const User = require("../models/user");
const Recipe = sequelize.define(
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
