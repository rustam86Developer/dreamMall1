'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pricing = sequelize.define('Pricing', {
    partnerId: DataTypes.INTEGER,
    pricingHeadId: DataTypes.INTEGER,
    value1: DataTypes.STRING,
    value2: DataTypes.STRING,
    value3: DataTypes.STRING,
    value4: DataTypes.STRING,
    value5: DataTypes.STRING,
    isCurrent: DataTypes.BOOLEAN,
    isSpecial: DataTypes.BOOLEAN
  }, {});
  Pricing.associate = function(models) {
    // associations can be defined here

    
    Pricing.hasMany(models.PaymentHistory,{ foreignKey: 'pricingId'});
    Pricing.belongsTo(models.Client,{foreignKey: 'id'});
    Pricing.belongsTo(models.PricingHead);
    
    Pricing.hasMany(models.SpecialEnrollment, {foreignKey: 'pricingId'});

  };
  return Pricing;
};