"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Pricings",
      [
        {
          id: 1,
          pricingHeadId: 1,
          value1: 195,
          value2: 18,
          value3: 0.25,
          value4: 89,
          isCurrent: true,
          isSpecial: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete("Pricings", { id: { [Op.in]: [1] } }, {});
  }
};
