'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubscriptionTypes = sequelize.define('SubscriptionTypes', {
    name: DataTypes.STRING,
  }, {});
  SubscriptionTypes.associate = function(models) {
    // associations can be defined here
  };
  return SubscriptionTypes;
};