"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("SystemUserTypes", [
      {
        id: 1,
        name: "Admin",
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: "Partner",
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: "Client",
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: "ISV",
        parentId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: "ISA/ISO",
        parentId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: "Referral",
        parentId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        name: "User Management",
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
