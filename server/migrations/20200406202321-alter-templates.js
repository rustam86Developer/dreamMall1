'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Templates', 'communicationType', { type: Sequelize.STRING, after: "clientId" });
    return Promise.resolve();
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Templates', 'communicationType');
    return Promise.resolve();
  }
};
