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
            res.json({delete: true, id: id});
        })
        .catch(error => {
            res.json({delete: false, id: id, error: error});
        })
});

module.exports = router;
