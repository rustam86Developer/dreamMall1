'use strict';
module.exports = (sequelize, DataTypes) => {
  const SelfPull = sequelize.define('SelfPull', {
    borrowerDatabaseId: DataTypes.INTEGER,
    clientId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    enabled: DataTypes.BOOLEAN
  }, {});
  SelfPull.associate = function (models) {
    // associations can be defined here
    SelfPull.belongsTo(models.BorrowerDatabase, { foreignKey: 'borrowerDatabaseId' })
  };
  return SelfPull;
};
