'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentHistory = sequelize.define('PaymentHistory', {
    clientId: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER,
    paymentCredentialId: DataTypes.INTEGER,
    pricingId: DataTypes.INTEGER
  }, {});
  PaymentHistory.associate = function (models) {
    PaymentHistory.belongsTo(models.PaymentCredential);
    // PaymentHistory.hasMany(models.Pricing,{ foreignKey: ''});
    PaymentHistory.belongsTo(models.Pricing);
    // associations can be defined here
    
  };
  return PaymentHistory;
};