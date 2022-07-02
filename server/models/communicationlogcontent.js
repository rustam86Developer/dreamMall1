'use strict';
module.exports = (sequelize, DataTypes) => {
  const CommunicationLogContent = sequelize.define('CommunicationLogContent', {
    fileName: DataTypes.STRING,
    type: DataTypes.STRING
  }, {});
  CommunicationLogContent.associate = function(models) {
    // associations can be defined here
    CommunicationLogContent.hasMany(models.CommunicationLog, { foreignKey: 'CommunicationLogContentId' });
    CommunicationLogContent.hasMany(models.ScheduledProcess, { foreignKey: 'CommunicationLogContentId' });
  };
  return CommunicationLogContent;
};