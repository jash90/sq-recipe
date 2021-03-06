var express = require("express");
var router = express.Router();
const { Recipe, RecipeIngredient, Ingredient } = require("../../models");
const _ = require("lodash");
const { Op } = require("sequelize");
const { OK, Error } = require("../../status");
router.post("/", async (req, res, next) => {
  let idIngredients = req.body.idIngredients;
  let recipes = [];
  let recipesIds = [];
  let ingredients = [];
  try {
    await RecipeIngredient.findAll({
      where: {
        idIngredient: {
          [Op.or]: idIngredients
        }
      }
    })
      .then(data => {
        data.forEach(ri => {
          const recipeIngredient = ri.dataValues;
          if (!recipesIds.includes(recipeIngredient.idRecipe)) {
            recipesIds.push(recipeIngredient.idRecipe);
          }
        });
      })
      .catch(error => {
        res.json({ error, Error });
      });
    if (recipesIds.length > 0) {
      await Ingredient.findAll()
        .then(data => {
          ingredients = data;
        })
        .catch(error => {
          res.json({ error, status: Error});
        });

      for (let index = 0; index < recipesIds.length; index++) {
        const element = recipesIds[index];
        let recipe;
        await Recipe.findOne({where:{ id: element} }).then(data => {
          recipe = data.dataValues;
          recipe.ingredients = [];
        });

        await RecipeIngredient.findAll({
          where: {
            idRecipe: element
          }
        }).then(data => {
          data.forEach(async ri => {
            const recipeIngredient = ri.dataValues;
            let item = _.find(ingredients, {
              id: recipeIngredient.idIngredient
            });
            item = item.dataValues;
            if (item) {
              recipeIngredient.name = item.name;
            }
            recipe.ingredients.push(recipeIngredient);
          });
        });
        await recipes.push(recipe);
      }
    }

    await res.json({ recipes, status:OK });
  } catch (error) {
    res.json({ error,  status: Error });
  }
});

module.exports = router;
