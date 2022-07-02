'use strict';
module.exports = (sequelize, DataTypes) => {
  const TuResponse = sequelize.define('TuResponse', {
    borrowerReferenceNumber: DataTypes.STRING,
    mortgageInquiry: DataTypes.STRING,
    type: DataTypes.STRING,
    permId: DataTypes.STRING,
    runDate: DataTypes.STRING,
    currentBalRecentMortgage: DataTypes.STRING,
    highCreditAmountRecentMortgage: DataTypes.STRING,
    monthlyPaymentRecentMortgage: DataTypes.STRING,
    openDateRecentMortgage: DataTypes.STRING,
    currentBal2ndRecentMortgage: DataTypes.STRING,
    highCredit2ndRecentMortgage: DataTypes.STRING,
    monthlyPayment2ndRecentMortgage: DataTypes.STRING,
    openDate2ndRecentMortgage: DataTypes.STRING,
    currentBal3rdRecentMortgage: DataTypes.STRING,
    highCredit3rdRecentMortgage: DataTypes.STRING,
    monthlyPayment3rdRecentMortgage: DataTypes.STRING,
    openDate3rdRecentMortgage: DataTypes.STRING,
    totalBalanceOpenRevolvingTrades: DataTypes.STRING,
    agencyCodeHistorical1: DataTypes.STRING,
    vaFhaLoanTagHistorical1: DataTypes.STRING,
    agencyCodeHistorical2: DataTypes.STRING,
    vaFhaLoanTagHistorical2: DataTypes.STRING,
    agencyCodeHistorical3: DataTypes.STRING,
    vaFhaLoanTagHistorical3: DataTypes.STRING,
    fico04Score: DataTypes.STRING,
    fico04Factor1: DataTypes.STRING,
    fico04Factor2: DataTypes.STRING,
    fico04Factor3: DataTypes.STRING,
    fico04Factor4: DataTypes.STRING
  }, {});
  TuResponse.associate = function (models) {

    // associations can be defined here
   TuResponse.belongsTo(models.BorrowerDatabase , { foreignKey: 'borrowerReferenceNumber' })
    
  };
  return TuResponse;
};