'use strict';
module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define('State', {
    stateCode: DataTypes.STRING,
    stateName: DataTypes.STRING
  }, {});
  State.associate = function(models) {
    // associations can be defined here
    State.hasMany(models.Address, {foreignKey: 'stateId'});
    State.hasMany(models.AdditionalSiteContactDetail, {foreignKey: 'stateId'});
  };
  return State;
};