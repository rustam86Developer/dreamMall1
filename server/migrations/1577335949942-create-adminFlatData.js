'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AdminFlatData', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      totalAlerts: {
        type: Sequelize.INTEGER
      },
      totalClients: {
        type: Sequelize.INTEGER
      },
      totalBranches: {
        type: Sequelize.INTEGER
      },
      totalMonitoredRecords: {
        type: Sequelize.INTEGER
      },
      totalAlertsAmount: {
        type: Sequelize.FLOAT
      },
      totalFicoAmount: {
        type: Sequelize.FLOAT
      },
      totalImplementationAmount: {
        type: Sequelize.FLOAT
      },
      monthFilter: {
        type: Sequelize.STRING
      },
      yearFilter: {
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
    return queryInterface.dropTable('AdminFlatData');
  }
};