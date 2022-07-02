'use strict';
module.exports = (sequelize, DataTypes) => {
  const IsvNotificationLog = sequelize.define('IsvNotificationLog', {
    partnerId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    totalAlerts: DataTypes.INTEGER,
    borrowerDatabaseIds: DataTypes.TEXT('long'),
    statusId: DataTypes.INTEGER,
    clientId:DataTypes.INTEGER,
    enrollStatus:DataTypes.STRING,
    type:DataTypes.STRING
  }, {});
  IsvNotificationLog.associate = function (models) {
    // associations can be defined here
  };
  return IsvNotificationLog;
};