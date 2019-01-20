var express = require('express');
var router = express.Router();
const Ingredient = require('../models/ingredient');
const Recipe = require('../models/recipe');
const RecipeIngredient = require('../models/recipeIngredient');
const db = require('./connect');
/* GET home page. */
router.post('/', async (req, res, next) => {
    const ingredients = req.body.ingredients;
    const name = req.body.name;
    const content = req.body.content;
    const preparationTime = req.body.preparationTime;
    const idUser = 3;
    var ingredientsRQ = [];
    let recipeIngredient = [];
    let transaction;
    let recipe;
    try {

        transaction = await db.transaction();

        for (let x = 0; x < ingredients.length; x++) {
            const i = ingredients[x];
            await Ingredient.findOrCreate({
                where: { name: i.name },
                transaction
            }).spread((ingredient, created) => {
                ingredientsRQ.push(ingredient.dataValues);
            });
        }
        await Recipe.create(
            { name, content, preparationTime, idUser },
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
                recipeIngredient.push(data.dataValues);
            });
        }
        console.log(recipe);
        console.log(recipeIngredient);
        console.log(ingredientsRQ);
        // commit
        res.json({ recipe, recipeIngredient });
        await transaction.commit();
    } catch (err) {
        // Rollback transaction if any errors were encountered
        console.log(err);
        res.json({});
        await transaction.rollback();
    }

});

module.exports = router;
