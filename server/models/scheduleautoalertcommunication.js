'use strict';
module.exports = (sequelize, DataTypes) => {
  const ScheduleAutoAlertEmail = sequelize.define('ScheduleAutoAlertCommunication', {
    clientId: DataTypes.INTEGER,
    scheduledProcessId:DataTypes.INTEGER,
    alerts: DataTypes.TEXT('long'),
    statusId: DataTypes.INTEGER,
    type: DataTypes.STRING
  }, {});
  ScheduleAutoAlertEmail.associate = function(models) {
    // associations can be defined here
  };
  return ScheduleAutoAlertEmail;
};
