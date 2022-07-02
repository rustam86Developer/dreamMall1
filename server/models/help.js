'use strict';
module.exports = (sequelize, DataTypes) => {
  const Help = sequelize.define('Help', {
    addedFor: DataTypes.STRING,
    helpType: DataTypes.STRING,
    documentOriginalName: DataTypes.STRING,
    documentModifiedName: DataTypes.STRING,
    documentTitle: DataTypes.STRING,
    documentDescription: DataTypes.STRING,
    videoOriginalName: DataTypes.STRING,
    videoModifiedName: DataTypes.STRING,
    videoTitle: DataTypes.STRING,
    videoDescription: DataTypes.STRING,
    faqQuestion: DataTypes.TEXT,
    faqAnswer: DataTypes.STRING
  }, {});
  Help.associate = function(models) {
    // associations can be defined here
  };
  return Help;
};