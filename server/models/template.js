'use strict';
module.exports = (sequelize, DataTypes) => {
  const Template = sequelize.define('Template', {
    clientId: DataTypes.INTEGER,
    communicationType: DataTypes.STRING,
    name: DataTypes.STRING,
    fileName: DataTypes.STRING,
    statusId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    subject: DataTypes.STRING
  }, {});
  Template.associate = function(models) {
    // associations can be defined here
  };
  return Template;
};