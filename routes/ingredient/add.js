var express = require("express");
var router = express.Router();
const { Ingredient } = require("../../models");
const { Error, OK } = require("../../status");
router.put("/", function(req, res, next) {
  const name = req.body.name;
  Ingredient.create({
    name: name
  })
    .then(data => {
      res.json({data : data.dataValues, OK});
    })
    .catch(error => {
      res.json({ error, Error });
    });
});

module.exports = router;
