'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClientNote = sequelize.define('ClientNote', {
    description: DataTypes.STRING,
    clientId: DataTypes.INTEGER
  }, {});
  ClientNote.associate = function(models) {
    // associations can be defined here
  };
  return ClientNote;
};