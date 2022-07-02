"use strict";
module.exports = (sequelize, DataTypes) => {
  const Submodule = sequelize.define(
    "Submodule",
    {
      name: DataTypes.STRING,
      moduleId: DataTypes.INTEGER,
      actionId: DataTypes.STRING,
      systemUserTypeId: DataTypes.INTEGER
    },
    {}
  );
  Submodule.associate = function(models) {
    // associations can be defined here
  };
  return Submodule;
};
