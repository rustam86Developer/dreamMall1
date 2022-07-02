'use strict';
module.exports = (sequelize, DataTypes) => {
  const ModulePricing = sequelize.define('ModulePricing', {
    moduleId: DataTypes.INTEGER,
    startRange: DataTypes.INTEGER,
    endRange: DataTypes.INTEGER,
    price: DataTypes.FLOAT
  }, {});
  ModulePricing.associate = function(models) {
    // associations can be defined here
  };
  return ModulePricing;
};