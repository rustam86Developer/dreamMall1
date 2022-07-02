'use strict';
module.exports = (sequelize, DataTypes) => {
  const CommunicationType = sequelize.define('CommunicationType', {
    name: DataTypes.STRING
  }, {});
  CommunicationType.associate = function(models) {
    // associations can be defined here
    CommunicationType.hasMany(models.CommunicationLog, { foreignKey: 'CommunicationTypeId' });
  };
  return CommunicationType;
};