'use strict';
module.exports = (sequelize, DataTypes) => {
  const LastEntry = sequelize.define('LastEntry', {
    clientId: DataTypes.INTEGER,
    value: DataTypes.STRING,
    type: DataTypes.STRING
  }, {});
  LastEntry.associate = function(models) {
    // associations can be defined here
  };
  return LastEntry;
};