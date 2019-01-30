var express = require("express");
var router = express.Router();
const { Ingredient } = require("../../models");
router.put("/", function(req, res, next) {
  const name = req.body.name;
  Ingredient.create({
    name: name
  })
    .then(data => {
      res.json(data.dataValues);
    })
    .catch(error => {
      res.json({ error: error });
    });
});

module.exports = router;
