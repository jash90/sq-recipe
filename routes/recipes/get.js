var express = require('express');
var router = express.Router();
const {Recipe} = require("../../models");
router.post('/', function (req, res, next) {
    Recipe
        .findAll()
        .then(data => {
            res.json(data);
        })
});

module.exports = router;