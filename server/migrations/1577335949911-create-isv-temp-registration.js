'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('IsvTempRegistrations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING
      },
      partnerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Partners',
          key: 'id'
        }
      },
      personalFirstName: {
        type: Sequelize.STRING
      },
      personalLastName: {
        type: Sequelize.STRING
      },
      personalTitle: {
        type: Sequelize.STRING
      },
      personalPhoneNumber: {
        type: Sequelize.STRING
      },
      personalMobileNumber: {
        type: Sequelize.STRING
      },
      personalEmail: {
        type: Sequelize.STRING
      },
      personalNmls: {
        type: Sequelize.STRING
      },
      personalAddress1: {
        type: Sequelize.STRING
      },
      personalAddress2: {
        type: Sequelize.STRING
      },
      personalState: {
        type: Sequelize.STRING
      },
      personalCity: {
        type: Sequelize.STRING
      },
      personalZipCode: {
        type: Sequelize.STRING
      },
      mainPocFirstName: {
        type: Sequelize.STRING
      },
      mainPocLastName: {
        type: Sequelize.STRING
      },
      mainPocTitle: {
        type: Sequelize.STRING
      },
      mainPocPhoneNumber: {
        type: Sequelize.STRING
      },
      mainPocMobileNumber: {
        type: Sequelize.STRING
      },
      mainPocEmail: {
        type: Sequelize.STRING
      },
      mainPocNmls: {
        type: Sequelize.STRING
      },
      mainPocAddress1: {
        type: Sequelize.STRING
      },
      mainPocAddress2: {
        type: Sequelize.STRING
      },
      mainPocState: {
        type: Sequelize.STRING
      },
      mainPocCity: {
        type: Sequelize.STRING
      },
      mainPocZipCode: {
        type: Sequelize.STRING
      },
      clientLegalName: {
        type: Sequelize.STRING
      },
      clientDbaName: {
        type: Sequelize.STRING
      },
      clientFederalTaxId: {
        type: Sequelize.STRING
      },
      clientBusinessClassification: {
        type: Sequelize.STRING
      },
      clientLocationType: {
        type: Sequelize.STRING
      },
      clientPhoneNumber: {
        type: Sequelize.STRING
      },
      clientWebsite: {
        type: Sequelize.STRING
      },
      clientEmail: {
        type: Sequelize.STRING
      },
      clientFax: {
        type: Sequelize.STRING
      },
      clientNmls: {
        type: Sequelize.STRING
      },
      clientType: {
        type: Sequelize.STRING
      },
      clientTypeName: {
        type: Sequelize.STRING
      },
      clientYearsOld: {
        type: Sequelize.STRING
      },
      loCount: {
        type: Sequelize.STRING
      },
      loansUnderManagement: {
        type: Sequelize.STRING
      },
      clientAddress1: {
        type: Sequelize.STRING
      },
      clientAddress2: {
        type: Sequelize.STRING
      },
      clientState: {
        type: Sequelize.STRING
      },
      clientCity: {
        type: Sequelize.STRING
      },
      clientZipCode: {
        type: Sequelize.STRING
      },
      billingFirstName: {
        type: Sequelize.STRING
      },
      billingLastName: {
        type: Sequelize.STRING
      },
      billingEmail: {
        type: Sequelize.STRING
      },
      billingPhoneNumber: {
        type: Sequelize.STRING
      },
      billingAddressLine1: {
        type: Sequelize.STRING
      },
      billingAddressLine2: {
        type: Sequelize.STRING
      },
      billingState: {
        type: Sequelize.STRING
      },
      billingCity: {
        type: Sequelize.STRING
      },
      billingZipCode: {
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
    return queryInterface.dropTable('IsvTempRegistrations');
  }
};