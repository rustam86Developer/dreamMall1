"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "CommunicationTypes",
      [
        {
          id: "1",
          name: "Single email",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "2",
          name: "Campaign email",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "3",
          name: "Mass email",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "4",
          name: "SMS",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      "CommunicationTypes",
      { id: { [Op.in]: [1, 2, 3, 4] } },
      {}
    );
  }
};
