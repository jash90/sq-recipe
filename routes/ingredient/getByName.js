var express = require("express");
var router = express.Router();
const { Ingredient } = require("../../models");
const { Op } = require("sequelize");
router.get("/", function(req, res, next) {
  const name = req.query.name;
  Ingredient.findAll({
    where: {
      name: {
        [Op.like]: `%${name}%`
      }
    }
  })
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.json({ error: error });
    });
});

module.exports = router;
