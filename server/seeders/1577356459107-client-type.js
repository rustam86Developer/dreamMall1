'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('ClientTypes', [
      {
      id:'1',
      name: 'Mortgage Broker',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id:'2',
      name: 'Mortgage Banker',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id:'3',
      name: 'Bank',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id:'4',
      name: 'Credit Union',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id:'5',
      name: 'Lender',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id:'6',
      name: 'Others',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});


  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op
    return queryInterface.bulkDelete('ClientTypes', {id: {[Op.in]: [1, 2, 3, 4, 5, 6]}}, {})
    }
};
