'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('BorrowerCustomValues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      borrowerDatabaseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'BorrowerDatabases',
          key: 'id'
        }
      },
      brokerCustomFieldId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'BrokerCustomFields',
          key: 'id'
        }
      },
      value: {
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
    return queryInterface.dropTable('BorrowerCustomValues');
  }
};