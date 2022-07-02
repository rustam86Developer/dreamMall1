'use strict';
module.exports = (sequelize, DataTypes) => {
  const SpecialEnrollment = sequelize.define('SpecialEnrollment', {
    linkExtension: DataTypes.STRING,
    pricingId: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    statusId: DataTypes.INTEGER
  }, {});
  SpecialEnrollment.associate = function (models) {
    // associations can be defined here
    SpecialEnrollment.belongsTo(models.Pricing, { foreignKey: 'pricingId' });
    SpecialEnrollment.hasMany(models.Client,{ foreignKey: 'specialEnrollmentId'});
    SpecialEnrollment.hasMany(models.SpecialEnrollmentInvitation,{ foreignKey: 'specialEnrollmentId'});
  };
  return SpecialEnrollment;
};