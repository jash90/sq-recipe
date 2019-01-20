var express = require('express');
var router = express.Router();
const ingredient = require("../models/ingredient");
const Sequelize = require("sequelize");
router.post('/', function (req, res, next) {
    const name = req.body.name;
    ingredient.findAll({
        where: {
            name: {
                [Sequelize.Op.like]: `%${name}%`
            }
        }
    }).then(data => {
        res.json(data);
    })
});

module.exports = router;
