'use strict';
module.exports = (sequelize, DataTypes) => {
  const FeatureSubscription = sequelize.define('FeatureSubscription', {
    clientId: DataTypes.INTEGER,
    subscriptionTypeId: DataTypes.INTEGER,
    subscribed: DataTypes.BOOLEAN,
    subscribedDate: DataTypes.DATE,
    submoduleId: DataTypes.STRING,

  }, {});
  FeatureSubscription.associate = function(models) {
    // associations can be defined here
  };
  return FeatureSubscription;
};