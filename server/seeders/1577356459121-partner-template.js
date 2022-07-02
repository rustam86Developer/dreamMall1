"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "PartnerTemplates",
      [
        {
          id: "1",
          name: "DefaultTemplate",
          isDefault: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      "PartnerTemplates",
      { id: { [Op.in]: [1] } },
      {}
    );
  }
};
