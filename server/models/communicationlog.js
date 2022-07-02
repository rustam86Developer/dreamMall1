'use strict';
module.exports = (sequelize, DataTypes) => {
  const CommunicationLog = sequelize.define('CommunicationLog', {
    clientId: DataTypes.INTEGER,
    borrowerDatabaseIds: DataTypes.TEXT('long'),
    communicationContent: DataTypes.TEXT('long'),
    communicationTypeId: DataTypes.INTEGER,
    communicationTime: DataTypes.STRING,
    subject: DataTypes.STRING,
    title: DataTypes.STRING,
    statusId: DataTypes.INTEGER,
    communicationLogContentId: DataTypes.INTEGER,
    scheduledProcessId: DataTypes.INTEGER,
    messageId: DataTypes.STRING,
    source: DataTypes.STRING
  }, {});
  CommunicationLog.associate = function (models) {
    // associations can be defined here
    CommunicationLog.belongsTo(models.BorrowerDatabase, { foreignKey: 'borrowerDatabaseIds' });
    CommunicationLog.belongsTo(models.CommunicationLogContent, { foreignKey: 'CommunicationLogContentId' });
    CommunicationLog.belongsTo(models.ScheduledProcess, { foreignKey: 'scheduledProcessId' });
    CommunicationLog.belongsTo(models.CommunicationType, { foreignKey: 'CommunicationTypeId' });
    CommunicationLog.belongsTo(models.Status, { foreignKey: 'statusId' });
  };
  return CommunicationLog;
};