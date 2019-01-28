var express = require('express');
var router = express.Router();
const {Ingredient} = require("../../models");
const {Op} = require("sequelize");
router.post('/', function (req, res, next) {
    const name = req.body.name;
    Ingredient.findAll({
        where: {
            name: {
                [Op.like]: `%${name}%`
            }
        }
    }).then(data => {
        res.json(data);
    })
});

module.exports = router;
