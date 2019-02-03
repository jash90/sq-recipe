var express = require("express");
var router = express.Router();
const { Recipe, RecipeIngredient, Ingredient } = require("../../models");
const _ = require("lodash");
const { OK, Error } = require("../../status");
router.get("/", async (req, res, next) => {
  let recipes = [];
  let ingredients = [];
  try {
    await Ingredient.findAll()
      .then(data => {
        ingredients = data;
      })
      .catch(error => {
        res.json({ error, status: Error });
      });
    await Recipe.findAll()
      .then(data => {
        recipes = data;
      })
      .catch(error => {
        res.json({ error, status:Error });
      });

    for (let index = 0; index < recipes.length; index++) {
      const element = recipes[index].dataValues;
      element.ingredients = [];
      await RecipeIngredient.findAll({
        where: {
          idRecipe: element.id
        }
      }).then(data => {
        data.forEach(async ri => {
          const recipeIngredient = ri.dataValues;
          element.ingredients.push(recipeIngredient);
        });
      });
    }

    await res.json({ recipes, status:OK });
  } catch (error) {
    res.json({ error, status:Error });
  }
});

module.exports = router;
