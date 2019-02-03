var express = require("express");
var router = express.Router();
const { Ingredient } = require("../../models");
const { Op } = require("sequelize");
const { OK, Error } = require("../../status");
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
      res.json({data, status:OK});
    })
    .catch(error => {
      res.json({ error, status:Error });
    });
});

module.exports = router;
