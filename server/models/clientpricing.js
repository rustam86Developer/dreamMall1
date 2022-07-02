'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClientPricing = sequelize.define('ClientPricing', {
    clientId: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER,
    pricingId: DataTypes.INTEGER
  }, {});
  ClientPricing.associate = function(models) {
    // associations can be defined here
    ClientPricing.belongsTo(models.Pricing);
  };
  return ClientPricing;
};