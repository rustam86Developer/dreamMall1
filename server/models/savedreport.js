'use strict';
module.exports = (sequelize, DataTypes) => {
  const SavedReport = sequelize.define('SavedReport', {
    clientId: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    searchCriteria: DataTypes.TEXT('long')
  }, {});
  SavedReport.associate = function(models) {
    // associations can be defined here
  };
  return SavedReport;
};