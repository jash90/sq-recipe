const db = require("../db");
const Sequelize = require("sequelize");
const User = db.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    login: {
      type: Sequelize.STRING(64),
      unique: true
    },
    password: {
      type: Sequelize.STRING(64)
    },
    accessToken: {
      type: Sequelize.STRING(64)
    },
    accessTokenExpiredAt: {
      type: Sequelize.DATE
    },
    refreshToken: {
      type: Sequelize.STRING(64)
    },
    refreshTokenExpiredAt: {
      type: Sequelize.DATE
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = User;