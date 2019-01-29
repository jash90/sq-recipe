var express = require('express');
var router = express.Router();
const {Ingredient} = require('../../models');
router.post('/', function (req, res, next) {
  Ingredient
    .findAll()
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.json({error: error});
    });
});

module.exports = router;
