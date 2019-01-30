var express = require("express");
var router = express.Router();
const { Recipe } = require("../../models");
const { Unauthorized } = require("../../status");
router.delete("/", async (req, res, next) => {
  const id = req.body.id;
  let idUser = 0;
  const token = req.headers.token;

  await User.findOne({
    where: { accessToken: token }
  })
    .then(data => {
      if (!data) {
        res.json({ Unauthorized });
      }
      idUser = data.dataValues.id;
    })
    .catch(error => {
      res.json({ DeniedLogin, error });
    });

  Recipe.destroy({
    where: {
      id: id,
      idUser: idUser
    }
  })
    .then(data => {
      if (!data) {
        res.json({ delete: false, id: id, Unauthorized });
      }
      res.json({ delete: true, id: id });
    })
    .catch(error => {
      res.json({ delete: false, id: id, error: error });
    });
});

module.exports = router;
