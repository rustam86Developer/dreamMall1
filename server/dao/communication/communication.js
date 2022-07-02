




const model = require('../../models');
var sequelize = require('sequelize');
const Op = sequelize.Op;

exports.addScheduledProcess = function (userObj) {

    model.CommunicationLog.create(userObj);
    return true
}