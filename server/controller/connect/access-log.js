const accessDao = require('../../dao/connect/access-log')
const errorLog = require('../../helper/common/logger').errorLog;
const httpStatus = require('../../helper/utilities/http-status');
const messages = require('../../helper/utilities/messages');

/**
 * get access log
 *  */ 
module.exports.accessLog = async function (req, res) {
    try {
        let getAccesslog = await accessDao.getAccessLog();
        res.status(httpStatus.OK).json(getAccesslog);
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`error occur while fetching accessLogs  : ${error} `);

    }
}