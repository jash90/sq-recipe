var express = require("express");
var router = express.Router();
const { Ingredient, Recipe, RecipeIngredient } = require("../../models");
const { Op } = require("sequelize");
const { OK, Error } = require("../../status");
var db = require("../../db");

router.put("/", async (req, res, next) => {
  const ingredients = req.body.ingredients;
  const name = req.body.name;
  const content = req.body.content;
  const preparationTime = req.body.preparationTime;
  var ingredientsRQ = [];
  let recipeIngredients = [];
  let transaction;
  let recipe;
  try {
    transaction = await db.transaction();

    for (let x = 0; x < ingredients.length; x++) {
      if (name === undefined) {
        await Ingredient.findOne({
          where: {
            id: idIngredient
          },
          transaction
        }).then(ingredient => {
          ingredientsRQ.push(ingredient.dataValues);
        });
      }
      if (idIngredient === undefined) {
        await Ingredient.create({ name: name }, { transaction }).then(
          ingredient => {
            ingredientsRQ.push(ingredient.dataValues);
          }
        );
      }
    }
    await Recipe.create(
      {
        name,
        content,
        preparationTime
      },
      { transaction }
    ).then(data => {
      recipe = data.dataValues;
    });

    for (let x = 0; x < ingredientsRQ.length; x++) {
      const irq = ingredientsRQ[x];
      const i = ingredients[x];
      await RecipeIngredient.create(
        {
          idRecipe: recipe.id,
          idIngredient: irq.id,
          count: i.count,
          unit: i.unit
        },
        { transaction }
      ).then(data => {
        recipeIngredients.push(data.dataValues);
      });
    }

    res.json({ recipe, recipeIngredients, OK });
    await transaction.commit();
  } catch (err) {
    res.json({ err, Error });
    await transaction.rollback();
  }
});

module.exports = router;
