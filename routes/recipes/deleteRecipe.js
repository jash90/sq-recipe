var express = require('express');
var router = express.Router();
const Recipe = require("../models/recipe");
const Sequelize = require("sequelize");
router.post('/', function (req, res, next) {
    const id = req.body.ida
    Recipe.destroy({
        where: {
            id
        }
    }).then(data => {
        res.json(data);
    })
});

module.exports = router;
