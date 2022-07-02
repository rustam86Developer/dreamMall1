'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('SiteInspectionDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clientId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Clients',
          key: 'id'
        }
      },
      date1: {
        type: Sequelize.DATEONLY
      },
      timeFrame1: {
        type: Sequelize.STRING
      },
      date2: {
        type: Sequelize.DATEONLY
      },
      timeFrame2: {
        type: Sequelize.STRING
      },
      date3: {
        type: Sequelize.DATEONLY
      },
      timeFrame3: {
        type: Sequelize.STRING
      },
      statusId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Statuses',
          key: 'id'
        }
      },
      remarks: {
        type: Sequelize.STRING
      },
      inspectedOn: {
        type: Sequelize.DATE
      },
      resultFileName: {
        type: Sequelize.STRING
      },
      resultFilePath: {
        type: Sequelize.STRING
      },
      siRefNum: {
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
    return queryInterface.dropTable('SiteInspectionDetails');
  }
};