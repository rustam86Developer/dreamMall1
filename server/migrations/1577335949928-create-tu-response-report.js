'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TuResponseReports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tuResponseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TuResponses',
          key: 'id'
        }
      },
      borrowerDatabaseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'BorrowerDatabases',
          key: 'id'
        }
      },
      clientId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Clients',
          key: 'id'
        }
      },
      partnerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Partners',
          key: 'id'
        }
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      brokerEmail: {
        type: Sequelize.STRING
      },
      brokerName: {
        type: Sequelize.STRING
      },
      value1: {
        type: Sequelize.STRING
      },
      value2: {
        type: Sequelize.STRING
      },
      value3: {
        type: Sequelize.STRING
      },
      value4: {
        type: Sequelize.STRING
      },
      statusId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Statuses',
          key: 'id'
        }
      },
      clientExists: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('TuResponseReports');
  }
};