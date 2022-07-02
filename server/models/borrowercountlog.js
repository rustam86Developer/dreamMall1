'use strict';
module.exports = (sequelize, DataTypes) => {
  const BorrowerCountLog = sequelize.define('BorrowerCountLog', {
    clientId: DataTypes.INTEGER,
    borrowerCount: DataTypes.INTEGER
  }, {});
  BorrowerCountLog.associate = function(models) {
    
  };
  return BorrowerCountLog;
};