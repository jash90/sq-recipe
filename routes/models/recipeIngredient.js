const sequelize = require('../../db');
const Sequelize = require('sequelize');
const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');
const RecipeIngredient = sequelize.define(
  'recipeIngredient',
  {
    idRecipe: {
      type: Sequelize.INTEGER
    },
    idIngredient: {
      type: Sequelize.INTEGER
    },
    count: {
      type: Sequelize.INTEGER
    },
    unit: {
      type: Sequelize.STRING(64)
    }
  },
  {
    freezeTableName:true,
    timestamps: false,
    tableName: 'recipeIngredient'
  }
);
Recipe.belongsToMany(Ingredient, {
  onDelete: 'CASCADE',
  through: RecipeIngredient,
  foreignKey: 'idRecipe',
});
Ingredient.belongsToMany(Recipe, {
  onDelete: 'CASCADE',
  through: RecipeIngredient,
  foreignKey: 'idIngredient',
});
module.exports = RecipeIngredient;
