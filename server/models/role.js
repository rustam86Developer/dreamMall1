'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: DataTypes.STRING,
    clientId: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER,
    accessControlJson: DataTypes.TEXT('long')
  }, {});
  Role.associate = function(models) {
    // associations can be defined here
    Role.hasMany(models.User, {foreignKey: 'roleId'});
  };
  return Role;
};