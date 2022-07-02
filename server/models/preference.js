'use strict';
module.exports = (sequelize, DataTypes) => {
  const Preference = sequelize.define('Preference', {
    clientId: DataTypes.INTEGER,
    autoEmail: DataTypes.BOOLEAN,
    autoSms: DataTypes.BOOLEAN,
    autoNotification: DataTypes.BOOLEAN,
    saveLogs: DataTypes.BOOLEAN,
    ficoPreference: DataTypes.INTEGER,
    scheduledEmail: DataTypes.BOOLEAN
   
  }, {});
  Preference.associate = function (models) {
    // associations can be defined here
    Preference.belongsTo(models.Client, { foreignKey: 'clientId' });
  };
  return Preference;
};
