const add = require("../recipes/add");
const edit = require("../recipes/edit");
const remove = require("../recipes/remove");
const get = require("../recipes/get");
module.exports = {
    addRecipe: add,
    editRecipe:edit,
    removeRecipe: remove,
    getRecipes: get
};