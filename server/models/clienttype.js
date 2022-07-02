'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClientType = sequelize.define('ClientType', {
    name: DataTypes.STRING
  }, {});
  ClientType.associate = function(models) {
    ClientType.hasMany(models.Client,{foreignKey: 'id'});
   
   
   // ClientType.belongsTo(models.company_info, {foreignKey: 'clientTypeId'});
    // associations can be defined here
  };
  return ClientType;
};