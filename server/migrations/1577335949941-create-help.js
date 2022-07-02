'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Help', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      addedFor: {
        type: Sequelize.STRING
      },
      helpType: {
        type: Sequelize.STRING
      },
      documentOriginalName: {
        type: Sequelize.STRING
      },
      documentModifiedName: {
        type: Sequelize.STRING
      },
      documentTitle: {
        type: Sequelize.STRING
      },
      documentDescription: {
        type: Sequelize.STRING
      },
      videoOriginalName: {
        type: Sequelize.STRING
      },
      videoModifiedName: {
        type: Sequelize.STRING
      },
      videoTitle: {
        type: Sequelize.STRING
      },
      videoDescription: {
        type: Sequelize.STRING
      },
      faqQuestion: {
        type: Sequelize.STRING
      },
      faqAnswer: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('Help');
  }
};