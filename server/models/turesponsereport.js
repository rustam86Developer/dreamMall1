'use strict';
module.exports = (sequelize, DataTypes) => {
  const TuResponseReport = sequelize.define('TuResponseReport', {
    tuResponseId: DataTypes.INTEGER,
    borrowerDatabaseId: DataTypes.INTEGER,
    clientId: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    brokerEmail: DataTypes.STRING,
    brokerName: DataTypes.STRING,
    value1: DataTypes.STRING,
    value2: DataTypes.STRING,
    value3: DataTypes.STRING,
    value4: DataTypes.STRING,
    statusId: DataTypes.INTEGER,
   // alertTxnNumber: DataTypes.STRING,
    clientExists: DataTypes.BOOLEAN
  }, {});
  TuResponseReport.associate = function(models) {
    // associations can be defined here
    TuResponseReport.belongsTo(models.BorrowerDatabase, {foreignKey: 'borrowerDatabaseId'});
    TuResponseReport.belongsTo(models.TuResponse,{foreignKey: 'tuResponseId'});
  };
  return TuResponseReport;
};