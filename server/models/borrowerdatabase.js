'use strict';
module.exports = (sequelize, DataTypes) => {
  const BorrowerDatabase = sequelize.define('BorrowerDatabase', {
    partnerId: DataTypes.INTEGER,
    clientId: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    ssn: DataTypes.STRING,
    mobileNumber: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    brokerLoFirstName: DataTypes.STRING,
    brokerLoLastName: DataTypes.STRING,
    brokerLoEmail: DataTypes.STRING,
    brokerLoPhoneNumber: DataTypes.STRING,
    brokerLoMobileNumber: DataTypes.STRING,
    alertStatusId: DataTypes.INTEGER,
    borrowerReferenceNumber: DataTypes.STRING,
    ficoScore: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER,
    alertDate: DataTypes.INTEGER,
    totalAlert : DataTypes.INTEGER,
    deletedAt: DataTypes.DATE,
  }, {});
  BorrowerDatabase.associate = function (models) {
    // associations can be defined here
    BorrowerDatabase.belongsTo(models.Status);
    BorrowerDatabase.hasMany(models.AlertHistory)
    // BorrowerDatabase.hasMany(models.TuResponse )
    BorrowerDatabase.hasMany(models.CommunicationLog,{ foreignKey: 'borrowerDatabaseId'});
    BorrowerDatabase.hasMany(models.SelfPull)
    BorrowerDatabase.hasMany(models.TuResponseReport, {foreignKey: 'id'});

  };
  return BorrowerDatabase;
};