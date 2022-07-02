'use strict';
module.exports = (sequelize, DataTypes) => {
  const BorrowerCustomValue = sequelize.define('BorrowerCustomValue', {
    borrowerDatabaseId: DataTypes.INTEGER,
    brokerCustomFieldId: DataTypes.INTEGER,
    value: DataTypes.STRING
  }, {});
  BorrowerCustomValue.associate = function(models) {
    // associations can be defined here
  };
  return BorrowerCustomValue;
};