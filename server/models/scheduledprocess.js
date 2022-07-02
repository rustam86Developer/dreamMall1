'use strict';
module.exports = (sequelize, DataTypes) => {
  const ScheduledProcess = sequelize.define('ScheduledProcess', {
    clientId: DataTypes.INTEGER,
    communicationType: DataTypes.INTEGER,
    borrowerDatabaseIds: DataTypes.TEXT('long'),
    communicationLogContentId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    date: DataTypes.STRING,
    recurrenceType: DataTypes.STRING,
    recurrenceDay: DataTypes.STRING,
    recurrenceTime: DataTypes.STRING,
    recurrenceDate: DataTypes.STRING,
    statusId: DataTypes.INTEGER,
    timeZone: DataTypes.STRING,
    emailSubject: DataTypes.STRING,
    title: DataTypes.STRING,
    cronId: DataTypes.STRING,
    // communicationLogId: DataTypes.INTEGER
  }, {});
  ScheduledProcess.associate = function (models) {
    // associations can be defined here
    ScheduledProcess.hasMany(models.CommunicationLog, { foreignKey: 'ScheduledProcessId' });
    ScheduledProcess.belongsTo(models.CommunicationLogContent, { foreignKey: 'communicationLogContentId' });
    ScheduledProcess.belongsTo(models.Status, { foreignKey: 'statusId' });
  };
  return ScheduledProcess;
};