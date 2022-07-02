'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FeatureSubscriptions', {
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
      subscriptionTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'SubscriptionTypes',
          key: 'id'
        }
      },
      subscribed: {
        type: Sequelize.BOOLEAN
      },
      subscribedDate: {
        type: Sequelize.DATE
      },
      submoduleId: {
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
    return queryInterface.dropTable('FeatureSubscriptions');
  }
};