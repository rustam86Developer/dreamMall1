'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TuResponses', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      borrowerReferenceNumber: {
        type: Sequelize.STRING
      },
      mortgageInquiry: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      permId: {
        type: Sequelize.STRING
      },
      runDate: {
        type: Sequelize.STRING
      },
      currentBalRecentMortgage: {
        type: Sequelize.STRING
      },
      highCreditAmountRecentMortgage: {
        type: Sequelize.STRING
      },
      monthlyPaymentRecentMortgage: {
        type: Sequelize.STRING
      },
      openDateRecentMortgage: {
        type: Sequelize.STRING
      },
      currentBal2ndRecentMortgage: {
        type: Sequelize.STRING
      },
      highCredit2ndRecentMortgage: {
        type: Sequelize.STRING
      },
      monthlyPayment2ndRecentMortgage: {
        type: Sequelize.STRING
      },
      openDate2ndRecentMortgage: {
        type: Sequelize.STRING
      },
      currentBal3rdRecentMortgage: {
        type: Sequelize.STRING
      },
      highCredit3rdRecentMortgage: {
        type: Sequelize.STRING
      },
      monthlyPayment3rdRecentMortgage: {
        type: Sequelize.STRING
      },
      openDate3rdRecentMortgage: {
        type: Sequelize.STRING
      },
      totalBalanceOpenRevolvingTrades: {
        type: Sequelize.STRING
      },
      agencyCodeHistorical1: {
        type: Sequelize.STRING
      },
      vaFhaLoanTagHistorical1: {
        type: Sequelize.STRING
      },
      agencyCodeHistorical2: {
        type: Sequelize.STRING
      },
      vaFhaLoanTagHistorical2: {
        type: Sequelize.STRING
      },
      agencyCodeHistorical3: {
        type: Sequelize.STRING
      },
      vaFhaLoanTagHistorical3: {
        type: Sequelize.STRING
      },
      fico04Score: {
        type: Sequelize.STRING
      },
      fico04Factor1: {
        type: Sequelize.STRING
      },
      fico04Factor2: {
        type: Sequelize.STRING
      },
      fico04Factor3: {
        type: Sequelize.STRING
      },
      fico04Factor4: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TuResponses');
  }
};