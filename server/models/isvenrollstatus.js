'use strict';
module.exports = (sequelize, DataTypes) => {
  const IsvEnrollStatus = sequelize.define('IsvEnrollStatus', {
    token: DataTypes.STRING,
    partnerId: DataTypes.INTEGER,
    clientId: DataTypes.INTEGER
  }, {});
  IsvEnrollStatus.associate = function(models) {
    // associations can be defined here
  };
  return IsvEnrollStatus;
};