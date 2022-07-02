'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentCredential = sequelize.define('PaymentCredential', {
    clientId: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER,
    credentialNumber: DataTypes.STRING,
    vaultId: DataTypes.STRING,
    expiryDate: DataTypes.STRING,
    credentialType: DataTypes.STRING,
    isPrimary: DataTypes.BOOLEAN,
    cardType: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING
  }, {});
  PaymentCredential.associate = function (models) {

    // PaymentCredential.hasMany(models.PaymentHistory,{ foreignKey: 'paymentCredentialId'});
    PaymentCredential.belongsTo(models.Client,{foreignKey: 'id'})
   PaymentCredential.hasOne(models.PaymentHistory,{ foreignKey: 'paymentCredentialId'});
  //  PaymentCredential.belongsToMany(models.Address, { through: 'GroupAddress' })
   PaymentCredential.hasMany(models.GroupAddress,{ foreignKey: 'clientId'});
   PaymentCredential.belongsToMany(models.Address, { through: 'GroupAddress', foreignKey: 'userId'})
   
   PaymentCredential.belongsToMany(models.Address, { through: 'GroupAddress', foreignKey: 'paymentCredentialId'})

   
  };
  return PaymentCredential;
};