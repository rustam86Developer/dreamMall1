"use strict";
module.exports = (sequelize, DataTypes) => {
  const AccessLog = sequelize.define(
    "AccessLog",
    {
      userId: DataTypes.INTEGER,
      userAgent: DataTypes.STRING,
      acceptLanguage: DataTypes.STRING,
      ipAddress: DataTypes.STRING,
      type: DataTypes.STRING
    },
    {}
  );
  AccessLog.associate = function (models) {
    AccessLog.belongsTo(models.User);
  };
  return AccessLog;
};
