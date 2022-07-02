'use strict';
module.exports = (sequelize, DataTypes) => {
  const DefaultTemplate = sequelize.define('DefaultTemplate', {
    clientId: DataTypes.INTEGER,
    templateId: DataTypes.INTEGER
  }, {});
  DefaultTemplate.associate = function(models) {
    // associations can be defined here
    DefaultTemplate.belongsTo(models.Template,{ foreignKey: 'templateId' });
  };
  return DefaultTemplate;
};