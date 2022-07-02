'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ScheduledProcesses', {
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
      borrowerDatabaseIds: {
        type: Sequelize.TEXT('long')
      },
      communicationLogContentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'CommunicationLogContents',
          key: 'id'
        }
      },
      type: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.STRING
      },
      recurrenceType: {
        type: Sequelize.STRING
      },
      recurrenceDay: {
        type: Sequelize.STRING
      },
      recurrenceTime: {
        type: Sequelize.STRING
      },
      recurrenceDate: {
        type: Sequelize.STRING
      },
      statusId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Statuses',
          key: 'id'
        }
      },
      timeZone: {
        type: Sequelize.STRING
      },
      emailSubject: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      cronId: {
        type: Sequelize.STRING
      },
      // communicationLogId: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'CommunicationLogs',
      //     key: 'id'
      //   }
      // },
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
    return queryInterface.dropTable('ScheduledProcesses');
  }
};