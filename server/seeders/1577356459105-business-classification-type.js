'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('BusinessClassificationTypes', [{
      id: 1,
      name: 'Sole Proprietor',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      name: 'Partnership',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 3,
      name: 'Corporation',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op
    return queryInterface.bulkDelete('BusinessClassificationTypes', { id: { [Op.in]: [1, 2, 3] } }, {})
  }
};
