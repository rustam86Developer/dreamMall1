'use strict';
module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    addressLine1: DataTypes.STRING,
    addressLine2: DataTypes.STRING,
    cityId: DataTypes.INTEGER,
    stateId: DataTypes.INTEGER,
    zipCode: DataTypes.STRING
  }, {});
  Address.associate = function(models) {
    // associations can be defined here
    Address.belongsTo(models.State,{ foreignKey: 'stateId'});
    Address.belongsTo(models.City,{ foreignKey: 'cityId'});
  };
  return Address;
};