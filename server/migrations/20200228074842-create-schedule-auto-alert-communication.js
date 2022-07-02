'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ScheduleAutoAlertCommunications', {
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
      scheduledProcessId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ScheduledProcesses',
          key: 'id'
        }
      },
      alerts: {
        type: Sequelize.TEXT('long'),
      },
      statusId: {
        type: Sequelize.INTEGER,
      },
      type: {
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
    return queryInterface.dropTable('ScheduleAutoAlertCommunications');
  }
};
