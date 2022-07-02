'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Partners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      companyName: {
        type: Sequelize.STRING
      },
      fein: {
        type: Sequelize.STRING
      },
      domain: {
        type: Sequelize.STRING
      },
      systemUserTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'SystemUserTypes',
          key: 'id'
        }
      },
      isvPaymentMode: {
        type: Sequelize.STRING
      },
      apiKey: {
        type: Sequelize.STRING
      },
      landingPageLinkExt: {
        type: Sequelize.STRING
      },
      receiveAlertsBy: {
        type: Sequelize.STRING
      },
      logoName: {
        type: Sequelize.STRING
      },
      token: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      statusId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Statuses',
          key: 'id'
        }
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
    return queryInterface.dropTable('Partners');
  }
};