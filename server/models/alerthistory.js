'use strict';
module.exports = (sequelize, DataTypes) => {
  const AlertHistory = sequelize.define('AlertHistory', {
    borrowerDatabaseId: DataTypes.INTEGER,
    tuResponseId: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER,
    remarks: DataTypes.TEXT
  }, {});
  AlertHistory.associate = function(models) {
    // associations can be defined here
    AlertHistory.belongsTo(models.Status, { foreignKey: 'statusId' });
    AlertHistory.belongsTo(models.BorrowerDatabase,{ foreignKey: 'borrowerDatabaseId'})
  };
  return AlertHistory;
};