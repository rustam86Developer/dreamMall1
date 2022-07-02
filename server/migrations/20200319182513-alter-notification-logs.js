'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('IsvNotificationLogs','clientId',{
      type: Sequelize.INTEGER,
      after: "partnerId"
    }),
    queryInterface.addColumn('IsvNotificationLogs','enrollStatus',{
      type: Sequelize.STRING,
      after: "statusId"
    }),
    queryInterface.addColumn('IsvNotificationLogs','type',{
      type: Sequelize.STRING,
      after: "enrollStatus"
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('IsvNotificationLogs','clientId'),
    queryInterface.removeColumn('IsvNotificationLogs','brokerId'),
    queryInterface.removeColumn('IsvNotificationLogs','type');
  }
};

