'use strict';
module.exports = (sequelize, DataTypes) => {
  const SpecialEnrollmentInvitation = sequelize.define('SpecialEnrollmentInvitation', {
    email: DataTypes.STRING,
    specialEnrollmentId: DataTypes.INTEGER
  }, {});
  SpecialEnrollmentInvitation.associate = function(models) {
    // associations can be defined here
    SpecialEnrollmentInvitation.belongsTo(models.SpecialEnrollment, {foreignKey: 'specialEnrollmentId'});
  };
  return SpecialEnrollmentInvitation;
};