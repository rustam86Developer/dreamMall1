'use strict';
module.exports = (sequelize, DataTypes) => {
  const Status = sequelize.define('Status', {
    name: DataTypes.STRING,
    code: DataTypes.INTEGER
  }, {});
  Status.associate = function(models) {
    // associations can be defined here
    Status.hasMany(models.AlertHistory , { foreignKey: 'statusId' })
    Status.hasMany(models.CommunicationLog, { foreignKey: 'statusId' });
    Status.hasMany(models.ScheduledProcess, { foreignKey: 'statusId' });
    Status.hasMany(models.Client, { foreignKey: 'statusId' });
  };
  return Status;
};