const sequelize = require('../connect');
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
    timestamps: false
  }
);
RecipeIngredient.hasMany(Recipe, { foreignKey: 'idRecipe', sourceKey: 'id' });
Recipe.belongsTo(RecipeIngredient, { foreignKey: 'idRecipe', targetKey: 'id' });
RecipeIngredient.hasMany(Ingredient, { foreignKey: 'idIngredient', sourceKey: 'id' });
Ingredient.belongsTo(RecipeIngredient, { foreignKey: 'idIngredient', targetKey: 'id' });
module.exports = RecipeIngredient;
