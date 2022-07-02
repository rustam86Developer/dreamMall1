"use strict";
module.exports = (sequelize, DataTypes) => {
  const Partner = sequelize.define(
    "Partner",
    {
      companyName: DataTypes.STRING,
      fein: DataTypes.STRING,
      domain: DataTypes.STRING,
      systemUserTypeId: DataTypes.INTEGER,
      isvPaymentMode: DataTypes.STRING,
      apiKey: DataTypes.STRING,
      landingPageLinkExt: DataTypes.STRING,
      receiveAlertsBy: DataTypes.STRING,
      statusId: DataTypes.INTEGER,
      logoName: DataTypes.STRING,
      description: DataTypes.STRING,
      token: DataTypes.STRING
    },
    {}
  );
  Partner.associate = function (models) {

    // associations can be defined here
    Partner.hasMany(models.User);
    /**
     * A partner will have multiple clients
     */

    Partner.hasMany(models.Client, { foreignKey: 'partnerId' });
    // Partner.hasMany(models.Client);
    /**
     *
     */
    //Partner.hasOne(models.PaymentDetail);
    /**
     *
     */
    Partner.hasMany(models.Pricing);
    /**
     * Partner
     */
    Partner.hasMany(models.SavedReport);
    // Partner.hasMany(models.SpecialEnrollment);

    Partner.hasOne(models.PartnerTemplateSelection, { foreignKey: 'partnerId' });
    Partner.belongsTo(models.SystemUserType, { foreignKey: 'SystemUserTypeId' });
    Partner.belongsToMany(models.Address, { through: 'GroupAddress' })
    Partner.hasMany(models.TuResponseReport);
    Partner.hasMany(models.Document, { foreignKey: 'partnerId' });

    Partner.hasMany(models.Document);

    Partner.hasMany(models.SystemUserType, { foreignKey: 'id' });

  };
  return Partner;
};
