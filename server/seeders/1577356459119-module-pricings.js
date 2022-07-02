"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "ModulePricings",
      [
        {
          id: 1,
          moduleId: 2,
          startRange: 1,
          endRange: 1000,
          price: 14.95,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          moduleId: 2,
          startRange: 1001,
          endRange: 10000,
          price: 24.95,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          moduleId: 2,
          startRange: 10001,
          endRange: 25000,
          price: 39.95,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 4,
          moduleId: 2,
          startRange: 25001,
          endRange: 50000,
          price: 59.5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 5,
          moduleId: 2,
          startRange: 50001,
          endRange: 100000,
          price: 79.5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 6,
          moduleId: 2,
          startRange: 100001,
          endRange: 500000,
          price: 99.5,
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
      "ModulePricings",
      { id: { [Op.in]: [1, 2, 3, 4] } },
      {}
    );
  }
};
