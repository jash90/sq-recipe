var express = require("express");
var router = express.Router();
const { Ingredient } = require("../../models");
const { Error, OK } = require("../../status");
router.get("/", function(req, res, next) {
  Ingredient.findAll()
    .then(data => {
      res.json({ data, OK });
    })
    .catch(error => {
      res.json({ error, Error });
    });
});

module.exports = router;
