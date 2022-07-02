"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "SubscriptionTypes",
      [
        {
          id: "1",
          name: "Engage",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "2",
          name: "Fico",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "3",
          name: "MarketPlace",
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      "CommunicationTypes",
      { id: { [Op.in]: [1, 2, 3] } },
      {}
    );
  }
};