'use strict';
module.exports = (sequelize, DataTypes) => {
  const BrokerCustomField = sequelize.define('BrokerCustomField', {
    name: DataTypes.STRING,
    clientId: DataTypes.STRING
  }, {});
  BrokerCustomField.associate = function(models) {
    // associations can be defined here
  };
  return BrokerCustomField;
};