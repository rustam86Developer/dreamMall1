'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      legalName: {
        type: Sequelize.STRING
      },
      dbaName: {
        type: Sequelize.STRING
      },
      federalTaxId: {
        type: Sequelize.STRING
      },
      bussinessClassificationTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'BusinessClassificationTypes',
          key: 'id'
        }
      },
      locationType: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      website: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      fax: {
        type: Sequelize.STRING
      },
      nmls: {
        type: Sequelize.STRING
      },
      clientTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ClientTypes',
          key: 'id'
        }
      },
      clientTypeName: {
        type: Sequelize.STRING
      },
      yearsOld: {
        type: Sequelize.STRING
      },
      loCount: {
        type: Sequelize.INTEGER
      },
      loansUnderManagement: {
        type: Sequelize.INTEGER
      },
      partnerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Partners',
          key: 'id'
        }
      },
      parentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Clients',
          key: 'id'
        }
      },
      billingEntity: {
        type: Sequelize.STRING
      },
      isParent: {
        type: Sequelize.BOOLEAN
      },
      statusId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Statuses',
          key: 'id'
        }
      },
      specialEnrollmentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'SpecialEnrollments',
          key: 'id'
        }
      },
      remarks: {
        type: Sequelize.TEXT('long')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Clients');
  }
};