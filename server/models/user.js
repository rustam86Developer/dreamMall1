'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    title: DataTypes.STRING,
    email: DataTypes.STRING,
    nmls: DataTypes.STRING,
    roleId: DataTypes.INTEGER,
    profilePicName: DataTypes.STRING,
    ownerLevel: DataTypes.STRING,
    mobileNumber: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    token: DataTypes.STRING,
    password: DataTypes.STRING,
    statusId: DataTypes.INTEGER,
    clientId: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER,
    systemUserTypeId: DataTypes.INTEGER,
    addedBy: DataTypes.INTEGER
  }, {});
  User.associate = function (models) {

     User.belongsTo(models.Client);
    /**
     *  User and Address are associated through common table i.e GroupAddress
     */
    User.belongsToMany(models.Address, { through: 'GroupAddress' })
    User.hasMany(models.GroupAddress,{ foreignKey: 'clientId'});
    User.belongsToMany(models.Address, { through: 'GroupAddress', foreignKey: 'userId'})
    User.belongsTo(models.Role, {foreignKey: 'roleId'});
    User.belongsTo(models.Status, {foreignKey: 'statusId'});
    User.belongsTo(models.SystemUserType, {foreignKey: 'systemUserTypeId'});
    User.hasMany(models.AccessLog);
  };
  return User;
};