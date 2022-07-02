'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ScheduledProcesses', 'communicationType', { type: Sequelize.STRING, after: "clientId" });
    return Promise.resolve();
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ScheduledProcesses', 'communicationType');
    return Promise.resolve();
  }
};
