"use strict";
module.exports = (sequelize, DataTypes) => {
  const AdditionalSiteContactDetail = sequelize.define(
    "AdditionalSiteContactDetail",
    {
      clientId: DataTypes.INTEGER,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      mobileNumber: DataTypes.STRING,
      address: DataTypes.STRING,
      stateId: DataTypes.INTEGER,
      cityId: DataTypes.INTEGER,
      zipCode: DataTypes.STRING,
      billingEntity: DataTypes.STRING,
      statusId: DataTypes.INTEGER,
      token: DataTypes.STRING
    },
    {}
  );
  AdditionalSiteContactDetail.associate = function(models) {
    AdditionalSiteContactDetail.belongsTo(models.Client, {
      foreignKey: "id"
    });
    AdditionalSiteContactDetail.belongsTo(models.Client, {
      foreignKey: "clientId"
    });
    AdditionalSiteContactDetail.belongsTo(models.City);
    AdditionalSiteContactDetail.belongsTo(models.State);
  };
  return AdditionalSiteContactDetail;
};
