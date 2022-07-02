"use strict";
module.exports = (sequelize, DataTypes) => {
  const AlertDistribution = sequelize.define(
    "AlertDistribution",
    {
      clientId: DataTypes.INTEGER,
      emailTo: DataTypes.STRING,
      emailCc: DataTypes.STRING,
      emailBcc: DataTypes.STRING
    },
    {}
  );
  AlertDistribution.associate = function(models) {
    // associations can be defined here
    AlertDistribution.belongsTo(models.Client, {
      foreignKey: "clientId"
    });
  };
  return AlertDistribution;
};
