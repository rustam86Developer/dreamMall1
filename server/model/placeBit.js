'use strict';
module.exports = (sequelize, DataTypes) => {
  const FeatureSubscription = sequelize.define('bitPlaced', {
    userId: DataTypes.INTEGER,
    bitAmount: DataTypes.INTEGER,
    bitOn: DataTypes.STRING,

  }, {});
  FeatureSubscription.associate = function(models) {
    // associations can be defined here
  };
  return FeatureSubscription;
};