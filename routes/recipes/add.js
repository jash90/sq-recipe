var express = require("express");
var router = express.Router();
const { Ingredient, Recipe, RecipeIngredient, User } = require("../../models");
const { Op } = require("sequelize");
const { OK, Error, Unauthorized } = require("../../status");
var db = require("../../db");

router.put("/", async (req, res, next) => {
  const ingredients = req.body.ingredients;
  const name = req.body.name;
  const content = req.body.content;
  const preparationTime = req.body.preparationTime;
  let idUser = 0;
  const token = req.headers.token;
  var ingredientsRQ = [];
  let recipeIngredients = [];
  let transaction;
  let recipe;
  try {
    transaction = await db.transaction();

    await User.findOne({
      where: { accessToken: token }
    })
      .then(data => {
        if (!data) {
          res.json({ Unauthorized });
        }
        idUser = data.dataValues.id;
      })
      .catch(error => {
        res.json({ DeniedLogin, error });
      });

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
        preparationTime,
        idUser
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

    res.json({ recipe, recipeIngredients });
    await transaction.commit();
  } catch (err) {
    res.json({ err });
    await transaction.rollback();
  }
});

module.exports = router;
