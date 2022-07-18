const model = require('../model');
// const moment = require('moment');
// const constants = require('../../helper/utilities/constants')
var sequelize = require('sequelize');
// const emailtrackinglog = require('../../models/emailtrackinglog');
const Op = sequelize.Op;

/**
 *  Add access log 
 */
exports.getData = function(data) {
    return model.Enroll.create({...data })
}

exports.placeBit = function(data) {
    return model.bitPlaced.create({...data })
}