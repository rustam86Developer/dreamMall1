'use strict';
module.exports = (sequelize, DataTypes) => {
  const AdminFlatData = sequelize.define('AdminFlatData', {
    totalAlerts: DataTypes.INTEGER,
    totalClients: DataTypes.INTEGER,
    totalBranches: DataTypes.INTEGER,
    totalMonitoredRecords: DataTypes.INTEGER,
    totalAlertsAmount: DataTypes.FLOAT,
    totalFicoAmount: DataTypes.FLOAT,
    totalImplementationAmount: DataTypes.FLOAT,
    monthFilter: DataTypes.STRING,
    yearFilter: DataTypes.STRING
  }, {});
  AdminFlatData.associate = function(models) {
    // associations can be defined here
  };
  return AdminFlatData;
};