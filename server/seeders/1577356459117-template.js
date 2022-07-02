'use strict';
const constant = require('../helper/utilities/constants')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Templates', [{
      id: 1,
      name: 'DefaultTemplate',
      fileName: 'DEFAULTTEMPLATE.txt',
      statusId: constant.status.ACTIVE,
      subject:'',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Templates', { id: { [Op.in]: [1] } }, {})
  }
};
