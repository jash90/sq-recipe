var router = require("express").Router();

const { User } = require("../../models");
const status = require("../../status");

const crypto = require("crypto-js");
const { LocalDateTime, nativeJs, convert } = require("js-joda");

router.post("/", async (req, res) => {
  var login = req.body.username;
  var pass = crypto.SHA256(req.body.password).toString(crypto.enc.Hex);
  let user = {};
  let data = {};
  try {
    await User.findOne({
      where: {
        login: login,
        password: pass
      }
    }).then(u => {
      if (!u) {
        res.json({
          status: status.DeniedLogin.code,
          message: status.DeniedLogin.message
        });
      }
      user = u.dataValues;
      data = u;
    });
    const {
      accessToken,
      accessTokenExpiredAt,
      refreshToken,
      refreshTokenExpiredAt
    } = user;
    const now = LocalDateTime.now();
    const accessTokenDate = LocalDateTime.from(
      nativeJs(new Date(accessTokenExpiredAt))
    );
    const refreshTokenDate = LocalDateTime.from(
      nativeJs(new Date(refreshTokenExpiredAt))
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
        .SHA256(user + new Date().getTime().toString())
        .toString(crypto.enc.Hex);
      const ATExpiresAt = convert(LocalDateTime.now().plusDays(1)).toDate();
      const RTExpiresAt = convert(LocalDateTime.now().plusWeeks(1)).toDate();
      console.log({ ATExpiresAt, RTExpiresAt });
      await data
        .update({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          accessTokenExpiredAt: ATExpiresAt,
          refreshTokenExpiredAt: RTExpiresAt
        })
        .then(userData => {
          res.json({
            userData,
            status: status.OK.code,
            message: status.OK.message
          });
        })
        .catch(error => {
          res.json({ error });
        });
    }
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;
