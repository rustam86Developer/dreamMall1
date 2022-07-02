'use strict';
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    legalName: DataTypes.STRING,
    dbaName: DataTypes.STRING,
    federalTaxId: DataTypes.STRING,
    bussinessClassificationTypeId: DataTypes.INTEGER,
    locationType: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    website: DataTypes.STRING,
    email: DataTypes.STRING,
    fax: DataTypes.STRING,
    nmls: DataTypes.STRING,
    clientTypeId: DataTypes.INTEGER,
    clientTypeName: DataTypes.STRING,
    yearsOld: DataTypes.STRING,
    loCount: DataTypes.INTEGER,
    loansUnderManagement: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER,
    parentId: DataTypes.INTEGER,
    billingEntity: DataTypes.STRING,
    isParent: DataTypes.BOOLEAN,
    specialEnrollmentId: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER,
    remarks: DataTypes.TEXT('long'),
  }, {});
  Client.associate = function (models) {
    // associations can be defined here

    Client.belongsTo(models.BusinessClassificationType, { foreignKey: 'bussinessClassificationTypeId' });
    Client.hasMany(models.User, { foreignKey: 'clientId' });
    Client.hasMany(models.Document);
    Client.hasMany(models.PaymentCredential);
    Client.hasMany(models.AdditionalSiteContactDetail);
    Client.hasMany(models.SiteInspectionDetail);
    Client.hasMany(models.PaymentHistory, { foreignKey: 'clientId' });
    Client.belongsTo(models.SystemUserType, { foreignKey: 'id' })
    Client.hasMany(models.ClientNote);
    //Client.belongsTo(models.Partner, { foreignKey: 'id' });
    Client.belongsTo(models.Partner);
    Client.belongsTo(models.ClientType, { foreignKey: 'clientTypeId' });
    Client.hasOne(models.Preference);
    Client.hasOne(models.SmtpDetail);
    Client.hasMany(models.ClientPricing);
    Client.hasOne(models.IsvEnrollStatus);
    Client.hasMany(models.SavedReport);
    Client.belongsToMany(models.Address, { through: 'GroupAddress' })
    Client.hasMany(models.GroupAddress, { foreignKey: 'clientId' });
    Client.hasMany(models.BorrowerDatabase);
    Client.hasMany(models.SelfPull);
    Client.hasMany(models.TuResponseReport);
    Client.belongsTo(models.SpecialEnrollment, { foreignKey: 'specialEnrollmentId' });
    Client.hasMany(models.FeatureSubscription);
    Client.hasMany(models.DefaultTemplate);
    Client.belongsTo(models.Status, { foreignKey: 'statusId' });
  };
  return Client;
};