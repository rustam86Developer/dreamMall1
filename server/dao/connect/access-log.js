const model = require('../../models');
var sequelize = require('sequelize');
const Op = sequelize.Op;

/**
 * get access log
 */
module.exports.getAccessLog = async function () {
    const accessLog = await model.User.findAll({
        attributes: ['firstName','lastName','email'],
        include: [
            {
                model: model.AccessLog,
                attributes: ['id','userAgent', 'acceptLanguage', 'ipAddress','type'],
                required: true
            }
        ],
        order: [
            [sequelize.col('AccessLogs.createdAt'), 'DESC']
        ]
    })
    return accessLog
}