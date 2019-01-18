var express = require('express');
var router = express.Router();
const db = require("./connect");
const recipe = require("./models/recipe");
/* GET home page. */
router.get('/', function(req, res, next) {
  recipe.create({name:"test22", content:"test", preparationTime:30, idUser: 3}).then(data=>{
    console.log(data.dataValues);
  })
  res.render('index', { title: 'Express' });
});

module.exports = router;
