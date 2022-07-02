'use strict';
module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    jsonContent: DataTypes.TEXT('long'),
    type: DataTypes.STRING,
    clientId: DataTypes.INTEGER
  }, {});
  AuditLog.associate = function (models) {
    // associations can be defined here
  };
  return AuditLog;
};