'use strict';
module.exports = (sequelize, DataTypes) => {
  const GroupAddress = sequelize.define('GroupAddress', {
    userId: DataTypes.INTEGER,
    clientId: DataTypes.INTEGER,
    addressId: DataTypes.INTEGER,
    paymentCredentialId: DataTypes.INTEGER
  }, {});
  GroupAddress.associate = function (models) {
    // associations can be defined here
    GroupAddress.belongsTo(models.Client, { foreignKey: 'clientId' });
    GroupAddress.belongsTo(models.User, { foreignKey: 'userId' });
    GroupAddress.belongsTo(models.PaymentCredential, { foreignKey: 'PaymentCredentialId' });
  };
  return GroupAddress;
};