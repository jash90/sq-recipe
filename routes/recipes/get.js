var express = require('express');
var router = express.Router();
const {Recipe, RecipeIngredient, Ingredient} = require("../../models");
const _ = require("lodash");
router.post('/', async(req, res, next) => {
    let recipes = [];
    let ingredients = [];
    try {
        await Ingredient
            .findAll()
            .then(data => {
                ingredients = data;
            })
            .catch(error => {
                res.json({error: error});
            });
        await Recipe
            .findAll()
            .then(data => {
                recipes = data;
            })
            .catch(error => {
                res.json({error: error});
            });

        for (let index = 0; index < recipes.length; index++) {
            const element = recipes[index].dataValues;
            element.ingredients = [];
            await RecipeIngredient
                .findAll({
                where: {
                    idRecipe: element.id
                }
            })
                .then(data => {
                    data.forEach(async(ri) => {
                        const recipeIngredient = ri.dataValues;
                        // let item = _.find(ingredients, {'id': recipeIngredient.idIngredient});
                        // item = item.dataValues;
                        // console.log(item);
                        // if (item) {
                        //     recipeIngredient.name = item.name;
                        // }
                        element
                            .ingredients
                            .push(recipeIngredient);
                    })
                })
        }

        await res.json({recipes});

    } catch (error) {
        res.json({error: error});
    }

});

module.exports = router;
