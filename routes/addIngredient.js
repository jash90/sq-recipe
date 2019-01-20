var express = require('express');
var router = express.Router();
const ingredient = require("./models/ingredient");
/* GET home page. */
router.post('/', function(req, res, next) {
  const name = req.body.name;
  ingredient.findOrCreate({where: {name}}).then(data=>{
    res.json(data);
  })
});

module.exports = router;
