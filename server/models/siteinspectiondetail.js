'use strict';
module.exports = (sequelize, DataTypes) => {
  const SiteInspectionDetail = sequelize.define('SiteInspectionDetail', {
    clientId: DataTypes.INTEGER,
    date1: DataTypes.DATEONLY,
    timeFrame1: DataTypes.STRING,
    date2: DataTypes.DATEONLY,
    timeFrame2: DataTypes.STRING,
    date3: DataTypes.DATEONLY,
    timeFrame3: DataTypes.STRING,
    statusId: DataTypes.INTEGER,
    remarks: DataTypes.STRING,
    inspectedOn: DataTypes.DATE,
    resultFileName: DataTypes.STRING,
    resultFilePath: DataTypes.STRING,
    siRefNum: DataTypes.STRING
  }, {});
  SiteInspectionDetail.associate = function(models) {
    SiteInspectionDetail.belongsTo(models.Client,{foreignKey: 'id'});
    // associations can be defined here
  };
  return SiteInspectionDetail;
};