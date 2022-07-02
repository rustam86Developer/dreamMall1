"use strict";
const constant = require('../helper/utilities/constants')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          id: 1,
          firstName :'Admin',
          lastName: '',
          email: "admin@stikkum.io",
          clientId: null,
          password:
            "$2b$10$T6NH51cVkDIPRN4pz36Zee.BRZUrgsSZYpiXwxnWKPbJvMFxN3cU2",
          systemUserTypeId: constant.systemUserType.ADMIN,
          statusId: constant.status.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete("Users", { id: { [Op.in]: [1] } }, {});
  }
};
