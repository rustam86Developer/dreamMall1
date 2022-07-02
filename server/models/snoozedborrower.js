'use strict';
module.exports = (sequelize, DataTypes) => {
  const SnoozedBorrower = sequelize.define('SnoozedBorrower', {
    clientId: DataTypes.INTEGER,
    borrowerDatabaseId: DataTypes.INTEGER,
    endDate: DataTypes.DATE,
    isDelete: DataTypes.BOOLEAN
  }, {});
  SnoozedBorrower.associate = function(models) {
    // associations can be defined here
  };
  return SnoozedBorrower;
};