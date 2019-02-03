var express = require("express");
var router = express.Router();
const { Ingredient, Recipe, RecipeIngredient } = require("../../models");
const db = require("../../db");
const _ = require("lodash");
const { OK, Error } = require("../../status");

router.put("/", async (req, res, next) => {
  const ingredients = req.body.ingredients;
  const id = req.body.id;
  const name = req.body.name;
  const content = req.body.content;
  const preparationTime = req.body.preparationTime;
  var ingredientsRQ = [];
  let recipeIngredients = [];
  let oldRecipeIngredients = [];
  let transaction;
  let recipe;

  try {
    transaction = await db.transaction();


    await Recipe.findByPk(id, {
      transaction
    }).then(data => {
      if (!data) {
        throw {
          messenge: "Recipe not exists."
        };
      }
      data
        .update({
          name: name,
          content: content,
          preparationTime: preparationTime
        })
        .then(data => {
          recipe = data.dataValues;
        });
    });

    for (let x = 0; x < ingredients.length; x++) {
      let { name, idIngredient } = ingredients[x];
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

    await RecipeIngredient.findAll({
      where: {
        idRecipe: recipe.id
      }
    }).then(data => {
      oldRecipeIngredients = data.map(ri => {
        const item = ri.dataValues;
        recipeIngredients.push(item);
        return {
          id: item.idIngredient
        };
      });
    });

    const newIngredients = ingredientsRQ.map(r => {
      return {
        id: r.id
      };
    });

    const deleteIngredients = _.differenceBy(
      oldRecipeIngredients,
      newIngredients,
      "id"
    );
    for (let x = 0; x < deleteIngredients.length; x++) {
      const element = deleteIngredients[x];
      const index = _.findIndex(recipeIngredients, {
        idIngredient: element.id
      });
      recipeIngredients.splice(index, 1);
      await RecipeIngredient.destroy({
        where: {
          idIngredient: element.id,
          idRecipe: recipe.id
        }
      });
    }
    const addIngredients = _.differenceBy(
      newIngredients,
      oldRecipeIngredients,
      "id"
    );
    for (let x = 0; x < addIngredients.length; x++) {
      const element = addIngredients[x];
      const index = _.findIndex(ingredientsRQ, {
        id: element.id
      });
      if (index > -1) {
        const irq = ingredientsRQ[index];
        const i = ingredients[index];
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
    }
    res.json({
      recipe,
      recipeIngredients,
      status:OK
    });
    await transaction.commit();
  } catch (err) {
    res.json({
      err,
      status:Error
    });
    await transaction.rollback();
  }
});

module.exports = router;
