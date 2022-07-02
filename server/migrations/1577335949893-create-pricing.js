'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Pricings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      partnerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Partners',
          key: 'id'
        }
      },
      pricingHeadId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PricingHeads',
          key: 'id'
        }
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
      value5: {
        type: Sequelize.STRING
      },
      isCurrent: {
        type: Sequelize.BOOLEAN
      },
      isSpecial: {
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
    return queryInterface.dropTable('Pricings');
  }
};