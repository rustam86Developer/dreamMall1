'use strict';
module.exports = (sequelize, DataTypes) => {
  const PartnerTemplate = sequelize.define('PartnerTemplate', {
    name: DataTypes.STRING,
    isDefault: DataTypes.BOOLEAN
  }, {});
  PartnerTemplate.associate = function(models) {
    // associations can be defined here
  };
  return PartnerTemplate;
};