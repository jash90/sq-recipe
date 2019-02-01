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
      let { name, idIngredient } = ingredients[x];
      if (name === undefined) {
        name = "";
      }
      if (idIngredient === undefined) {
        idIngredient = 0;
      }
      await Ingredient.findOrCreate({
        where: {
          [Op.or]: [
            {
              name: name
            },
            {
              id: idIngredient
            }
          ]
        },
        transaction
      }).spread((ingredient, created) => {
        ingredientsRQ.push(ingredient.dataValues);
      });
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
