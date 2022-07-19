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

exports.getEmailPass = async function(data) {
    console.log("222222222",`SELECT * FROM Enrolls where (email = '${data.mobileNumberEmail}' or mobile = '${data.mobileNumberEmail}') and password = '${data.password}'`, { type: sequelize.QueryTypes.SELECT });

    const users = await model.sequelize.query(`SELECT * FROM Enrolls where (email = '${data.mobileNumberEmail}' or mobile = '${data.mobileNumberEmail}') and password = '${data.password}'`,
    { type: sequelize.QueryTypes.SELECT });

    console.log("5555555",users);
    return users
}

// await model.sequelize.query(
//     `UPDATE BorrowerDatabases SET isPartOfSequence =true WHERE '${condition}
// `, { transaction: transaction, type: sequelize.QueryTypes.UPDATE }
// )