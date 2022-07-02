'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserToken = sequelize.define('UserToken', {
    userId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    purpose: DataTypes.STRING,
    expiresAt: DataTypes.DATE
  }, {});
  UserToken.associate = function(models) {
    // associations can be defined here
  };
  return UserToken;
};