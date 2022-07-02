"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "PricingHeads",
      [
        {
          id: 1,
          name: "Stikkum",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: "Partner",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          name: "Special Links",
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
      "PricingHeads",
      { id: { [Op.in]: [1, 2] } },
      {}
    );
  }
};
