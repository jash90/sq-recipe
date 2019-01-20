const sequelize = require('../connect');
const Sequelize = require('sequelize');
const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');
const RecipeIngredient = sequelize.define(
  'recipeIngredients',
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
    timestamps: false
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
