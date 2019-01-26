var express = require('express');
var router = express.Router();
const {Ingredient, Recipe, RecipeIngredient} = require('../../models');
const db = require('../../db');
const {Op} = require("sequelize");
const _ = require("lodash");
router.post('/', async(req, res, next) => {
    const ingredients = req.body.ingredients;
    const id = req.body.id;
    const name = req.body.name;
    const content = req.body.content;
    const preparationTime = req.body.preparationTime;
    const idUser = 3;
    var ingredientsRQ = [];
    let recipeIngredients = [];
    let oldRecipeIngredients = [];
    let transaction;
    let recipe;
    try {

        transaction = await db.transaction();

        for (let x = 0; x < ingredients.length; x++) {
            const i = ingredients[x];
            await Ingredient.findOrCreate({
                where: {
                    [Op.or]: [
                        {
                            name: i.id
                        }, {
                            id: i.idIngredient
                        }
                    ]
                },
                transaction
            }).spread((ingredient, created) => {
                ingredientsRQ.push(ingredient.dataValues);
            });
        }
        await Recipe
            .findByPk(id, {transaction})
            .then(data => {
                data
                    .update({name: name, content: content, preparationTime: preparationTime})
                    .then(data => {
                        recipe = data.dataValues;
                    })
            });

        await RecipeIngredient
            .findAll({
            where: {
                idRecipe: recipe.id
            }
        })
            .then(data => {
                oldRecipeIngredients = data.map(ri => {
                    const item = ri.dataValues;
                    return item;
                });
            });
            console.log({"ingredients":ingredients, "ingredientsRQ":ingredientsRQ});
        for (let x = 0; x < ingredientsRQ.length; x++) {
            const irq = ingredientsRQ[x];
            const i = ingredients[x];
            await RecipeIngredient.findOrCreate({
                where: {
                    idRecipe: recipe.id,
                    idIngredient: irq.id,
                    count: i.count,
                    unit: i.unit
                },
                transaction
            }).then(data => {
                data.forEach(ri=>{
                    recipeIngredients.push(ri.dataValues);
                });
               
            });
        }
        oldRecipeIngredients.forEach(item => {
            if (!recipeIngredients.includes(item)) {
                RecipeIngredient.destroy({where :item});
            }
        });
        res.json({recipe, recipeIngredients});
        await transaction.commit();
    } catch (err) {
        // Rollback transaction if any errors were encountered
        console.log(err);
        res.json({});
        await transaction.rollback();
    }

});

module.exports = router;
