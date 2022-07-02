'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CommunicationLogs', {
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
      communicationContent: {
        type: Sequelize.TEXT('long')
      },
      communicationTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'CommunicationTypes',
          key: 'id'
        }
      },
      communicationTime: {
        type: Sequelize.STRING
      },
      subject: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      statusId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Statuses',
          key: 'id'
        }
      },
      communicationLogContentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'CommunicationLogContents',
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
      messageId: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).catch(e=>console.log(e));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CommunicationLogs');
  }
};