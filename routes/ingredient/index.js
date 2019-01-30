const add = require("../ingredient/add");
const get = require("../ingredient/get");
const getByName = require("../ingredient/getByName");
module.exports = {
  addIngredient: add,
  getIngredients: get,
  getIngredientsByName: getByName
};
