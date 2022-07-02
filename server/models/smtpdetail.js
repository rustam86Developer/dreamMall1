'use strict';
module.exports = (sequelize, DataTypes) => {
  const SmtpDetail = sequelize.define('SmtpDetail', {
    clientId: DataTypes.INTEGER,
    host: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    port: DataTypes.INTEGER
  }, {});
  SmtpDetail.associate = function(models) {
    // associations can be defined here
  };
  return SmtpDetail;
};