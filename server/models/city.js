'use strict';
module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    stateId: DataTypes.INTEGER,
    city: DataTypes.STRING,
    county: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING
  }, {});
  City.associate = function(models) {
    // associations can be defined here
    City.hasMany(models.Address, {foreignKey: 'cityId'});
    City.hasMany(models.AdditionalSiteContactDetail, {foreignKey: 'cityId'});
  };
  return City;
};