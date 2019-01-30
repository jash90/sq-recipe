var router = require("express").Router();

const { User } = require("../../models");
const status = require("../../status");

const crypto = require("crypto-js");

router.post("/", function(req, res) {
  var user = req.body.username;
  var pass = req.body.password;

  pass = crypto.SHA256(pass).toString(crypto.enc.Hex);
  User.create({ login: user, password: pass })
    .then(data => {
      const {id, login} = data.dataValues;
      res.json({
        data: {id, login},
        status: status.OK.code,
        message: status.OK.message
      });
    })
    .catch(error => {
      res.json({ status: status.Error.code, message: error });
    });
});

module.exports = router;
