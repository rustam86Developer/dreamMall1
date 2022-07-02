'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Roles', [
      {
        id: 1,
        name: 'STIKKUM ADMIN',
        accessControlJson: JSON.stringify({"Role":"STIKKUM ADMIN","Access":[{"moduleId":1,"submodule":[{"smid":1,"Action":[3,22,23]},{"smid":2,"Action":[3,4,6,10,20,23]},{"smid":3,"Action":[1,2,4,7,9,18,23]},{"smid":4,"Action":[1,2,3,6,23]},{"smid":5,"Action":[2,3,23]},{"smid":6,"Action":[1,2,3,4,23]},{"smid":7,"Action":[3]},{"smid":8,"Action":[1,2,3,4,9,23]},{"smid":9,"Action":[1,2,3,4,23]},{"smid":10,"Action":[1,2,3,4,21,23]},{"smid":11,"Action":[2]},{"smid":12,"Action":[3]}]}]}),
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 2,
        name: 'STIKKUM PARTNER',
        accessControlJson:JSON.stringify({"Role":"PARTNER","Access":[{"moduleId":1,"submodule":[{"smid":24,"Action":[3]},{"smid":25,"Action":[3,20,23]},{"smid":26,"Action":[3,9,23]},{"smid":27,"Action":[14,15,23]},{"smid":28,"Action":[3,9,23]},{"smid":29,"Action":[1,2,3,4,21,23]},{"smid":30,"Action":[3]},{"smid":31,"Action":[2]}]}]}),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'STIKKUM CLIENT',
        accessControlJson:JSON.stringify({"Role":"STIKKUM CLIENT","Access":[{"moduleId":1,"submodule":[{"smid":13,"Action":[3]},{"smid":14,"Action":[1,2,3,4,5,8,9,11,19,23]},{"smid":15,"Action":[2,3,4,12,23]},{"smid":16,"Action":[2,3,8,9,23]},{"smid":17,"Action":[1,13,4,23]},{"smid":18,"Action":[3]},{"smid":19,"Action":[3,9,23]},{"smid":20,"Action":[2,3,23]},{"smid":21,"Action":[1,2,3,4,23]},{"smid":22,"Action":[1,2,3,4,21,23]},{"smid":23,"Action":[2]}]},{"moduleId":2,"submodule":[{"smid":32,"Action":[3,4,5,16,17,20,23]}]}]}),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op
    return queryInterface.bulkDelete('Roles', { id: { [Op.in]: [1] } }, {})
  }
};