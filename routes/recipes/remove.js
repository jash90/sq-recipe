var express = require("express");
var router = express.Router();
const { Recipe } = require("../../models");
const { Unauthorized, Error, OK } = require("../../status");
router.delete("/", async (req, res, next) => {
  const id = req.body.id;

  Recipe.destroy({
    where: {
      id: id
    }
  })
    .then(data => {
      if (!data) {
        res.json({ delete: false, id: id, Unauthorized });
      }
      res.json({ delete: true, id: id, OK });
    })
    .catch(error => {
      res.json({ delete: false, id: id, error: error, Error });
    });
});

module.exports = router;
