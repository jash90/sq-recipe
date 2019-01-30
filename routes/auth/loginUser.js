var router = require("express").Router();

const { User } = require("../../models");
const status = require("../../status");

const crypto = require("crypto-js");
const { LocalDateTime, nativeJs } = require("js-joda");

router.post("/", async (req, res) => {
  var login = req.body.username;
  var pass = crypto.SHA256(req.body.password).toString(crypto.enc.Hex);
  let user = {};
  try {
    await User.findOne({
      where: {
        login: login,
        password: pass
      }
    }).then(data => {
      if (data) {
        user = data.dataValues;
        const {
          accessToken,
          accessTokenExpiresAt,
          refreshToken,
          refreshTokenExpiresAt
        } = user;
        const now = LocalDateTime.now();
        const accessTokenDate = LocalDateTime.from(
          nativeJs(new Date(accessTokenExpiresAt))
        );
        const refreshTokenDate = LocalDateTime.from(
          nativeJs(new Date(refreshTokenExpiresAt))
        );
        if (
          accessToken &&
          refreshToken &&
          accessTokenDate.isAfter(now) &&
          refreshTokenDate.isAfter(now)
        ) {
          res.json({
            data,
            status: status.OK.code,
            message: status.OK.message
          });
        } else {
          var newAccessToken = crypto
            .SHA256(user + new Date().toString())
            .toString(crypto.enc.Hex);
          var newRefreshToken = crypto
            .SHA256(user + new Date().toString())
            .toString(crypto.enc.Hex);
          var ATExpiresAt = LocalDateTime.now().plusDays(1);
          var RTExpiresAt = LocalDateTime.now().plusWeeks(1);
          data
            .update({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
              accessTokenExpiresAt: ATExpiresAt,
              refreshTokenExpiresAt: RTExpiresAt
            })
            .then(data => {
              res.json({ data });
            })
            .catch(error => {
              res.json({ error });
            });
        }
      } else {
        res.json({
          status: status.DeniedLogin.code,
          message: status.DeniedLogin.message
        });
      }
    });
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;
