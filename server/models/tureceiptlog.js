'use strict';
module.exports = (sequelize, DataTypes) => {
  const TuReceiptLog = sequelize.define('TuReceiptLog', {
    fcraFileName: DataTypes.STRING,
    triggerFileName: DataTypes.STRING
  }, {});
  TuReceiptLog.associate = function(models) {
    // associations can be defined here
  };
  return TuReceiptLog;
};