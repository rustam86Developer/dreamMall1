'use strict';
module.exports = (sequelize, DataTypes) => {
  const SystemUserType = sequelize.define('SystemUserType', {
    name: DataTypes.STRING,
    parentId: DataTypes.INTEGER
  }, {});
  SystemUserType.associate = function(models) {
    
    SystemUserType.hasMany(models.Partner,{foreignKey: 'id'});
    // associations can be defined here
  };
  return SystemUserType;
};