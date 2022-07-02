'use strict';
module.exports = (sequelize, DataTypes) => {
  const EngageFlatData = sequelize.define('EngageFlatData', {
    clientId: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    monthFilter: DataTypes.STRING,
    yearFilter: DataTypes.STRING
  }, {});
  EngageFlatData.associate = function(models) {
    // associations can be defined here
  };
  return EngageFlatData;
};