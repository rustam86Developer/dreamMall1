"use strict";
module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define(
    "Action",
    {
      name: DataTypes.STRING
    },
    {}
  );
  Action.associate = function(models) {
    // Action.hasMany(models.Submodule, { foreignKey: "actionId" });
  };
  return Action;
};
