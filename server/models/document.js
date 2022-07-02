'use strict';
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    clientId: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    statusId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    path: DataTypes.STRING,
    remarks: DataTypes.STRING
  }, {});
  Document.associate = function(models) {

    Document.belongsTo(models.Client,{foreignKey: 'id'});
    // associations can be defined here
  };
  return Document;
};