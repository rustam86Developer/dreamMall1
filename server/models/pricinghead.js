'use strict';
module.exports = (sequelize, DataTypes) => {
  const PricingHead = sequelize.define('PricingHead', {
    name: DataTypes.STRING
  }, {});
  PricingHead.associate = function(models) {
    // associations can be defined here
  };
  return PricingHead;
};