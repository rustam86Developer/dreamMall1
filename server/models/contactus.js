'use strict';
module.exports = (sequelize, DataTypes) => {
  const ContactUs = sequelize.define('ContactUs', {
    token: DataTypes.STRING,
    name: DataTypes.STRING,
    clientEmail: DataTypes.STRING,
    legalName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    learnAbout: DataTypes.STRING,
    clientId: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER
  }, {});
  ContactUs.associate = function (models) {
    // associations can be defined here
  };
  return ContactUs;
};