'use strict';
module.exports = (sequelize, DataTypes) => {
  const PartnerTemplateSelection = sequelize.define('PartnerTemplateSelection', {
    partnerTemplateId: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    description: DataTypes.STRING

  }, {});
  PartnerTemplateSelection.associate = function(models) {
    // associations can be defined here
  };
  return PartnerTemplateSelection;
};