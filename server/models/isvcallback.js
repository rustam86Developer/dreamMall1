'use strict';
module.exports = (sequelize, DataTypes) => {
  const IsvCallback = sequelize.define('IsvCallback', {
    partnerId: DataTypes.INTEGER,
    enrollStatusUrl: DataTypes.STRING,
    alertUrl: DataTypes.STRING,
    callbackApiKey: DataTypes.STRING
  }, {});
  IsvCallback.associate = function(models) {
    // associations can be defined here
  };
  return IsvCallback;
};