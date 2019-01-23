var express = require('express');
var router = express.Router();
const {Ingredient} = require("../../models");
/* GET home page. */
router.post('/', function (req, res, next) {
  const name = req.body.name;
  Ingredient
    .findOrCreate({where: {
      name
    }})
    .then(data => {
      res.json(data);
    })
});

module.exports = router;
