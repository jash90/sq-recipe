var express = require('express');
var router = express.Router();
const {Recipe} = require("../../models");
router.post('/', function (req, res, next) {
    const id = req.body.id;
    Recipe
        .destroy({where: {
            id
        }})
        .then(data => {
            res.json(data);
        })
});

module.exports = router;