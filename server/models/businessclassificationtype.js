'use strict';
module.exports = (sequelize, DataTypes) => {
  const BusinessClassificationType = sequelize.define('BusinessClassificationType', {
    name: DataTypes.STRING
  }, {});
  BusinessClassificationType.associate = function(models) {
  };
  return BusinessClassificationType;
};