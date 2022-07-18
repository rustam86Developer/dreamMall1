'use strict';
module.exports = (sequelize, DataTypes) => {
  const FeatureSubscription = sequelize.define('Enroll', {
    // clientId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    mobile: DataTypes.STRING,
    address: DataTypes.STRING,
    password: DataTypes.STRING,

  }, {});
  FeatureSubscription.associate = function(models) {
    // associations can be defined here
  };
  return FeatureSubscription;
};