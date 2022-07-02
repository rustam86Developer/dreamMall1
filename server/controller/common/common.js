const dao = require('../../dao/common/common')
const messages = require('../../helper/utilities/messages');
const errorLog = require('../../helper/common/logger').errorLog;
const httpStatus = require('../../helper/utilities/http-status');
const constants = require('../../helper/utilities/constants');
const moment = require('moment');
const communicationHelper = require('../../helper/engage/communication');
const commonHelper = require('../../helper/common/common')
/**
    * @author Aasif Khan
    * @description add access log 
  */
module.exports.updateAccessLog = async function (req, res) {
    try {
        let updateStatus = await dao.updateAccessLog(req.body);
        res.status(httpStatus.OK).json({ updateStatus: updateStatus })
    } catch (error) {
        res.json({ message: messages.errorMessage })
        errorLog.error(`Error occured while updating access log : ${error},`);
    }
}

/**
    * @author Neha Mangla
    * @description check & validate duplicate email from user table
  */

module.exports.checkUserEmail = async function (req, res) {
    try {
        
        let emailStatus = await dao.checkUserEmail(req.query);
        res.status(httpStatus.OK).json({ status: emailStatus ? true : false, message: emailStatus ? messages.toastr.EMAIL_ALREADY_EXISTS : '' })
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error occured while Checking Duplicate Email: ${error}, User Email Is: ${req.params.emailId}`);
    }
}

module.exports.checkBranchEmail = async function (req, res) {
    try {
        
        let emailStatus = await dao.checkBranchEmail(req.query);
        res.status(httpStatus.OK).json({ status: emailStatus ? true : false, message: emailStatus ? messages.toastr.EMAIL_ALREADY_EXISTS : '' })
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error occured while Checking Duplicate Email: ${error}, Branch Email Is: ${req.params.emailId}`);
    }
}

/**
 * @author Ananda pratap singh
 */
module.exports.updateClientStatus = async function (req, res) {
    try {
        let updateStatus = await dao.updateClientStatus(req.query.clientId, req.query.statusId);
        res.status(httpStatus.OK).json({ message: messages.toastr.CLIENT_STATUS_UPDATED })

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error occured in updating client status : ${error}`);
    }
}

module.exports.subscribeFICO = async function (req, res) {
    try {

        var clientId;
        let client = await dao.getClientIdByEmail(req.body.companyEmail);

        if (client) {
            clientId = client.id;

        }
        else {

            var user = await dao.getUserByEmail(req.body.companyEmail);
            if (user) {
                clientId = user.clientId
            }
            else {
                return res.status(httpStatus.OK).json({ status: false, message: messages.toastr.INCORRECT_EMAIL })
            }
        }
        let ficoService = await dao.checkIfAlreadySubscribed(clientId, constants.subscriptionType.FICO);
        if (ficoService.subscribed) {
            return res.status(httpStatus.OK).json({ status: false, message: messages.toastr.FICO_ALREADY_SUBSCRIBED })
        }

        let userInfo = await dao.getUserByClientId(clientId);
        await commonHelper.sendFicoSubscribedEmail(userInfo);
        await dao.updateFeatureSubscription(clientId, constants.subscriptionType.FICO);
        res.status(httpStatus.OK).json({ status: true })

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error occured during subscribing engage : ${error}`);
    }
}

module.exports.subscribeEngage = async function (req, res) {
    try {

        let client = await dao.getClientIdByEmail(req.body.companyEmail);
        if (client) {
            clientId = client.id;

        }
        else {

            var user = await dao.getUserByEmail(req.body.companyEmail);
            if (user) {
                clientId = user.clientId
            }
            else {
                return res.status(httpStatus.OK).json({ status: false, message: messages.toastr.INCORRECT_EMAIL })
            }
        }
        let engageService = await dao.checkIfAlreadySubscribed(clientId, constants.subscriptionType.ENGAGE);
        if (engageService.subscribed) {
            return res.status(httpStatus.OK).json({ status: false, message: messages.toastr.ENGAGE_ALREADY_SUBSCRIBED })
        }

        let userInfo = await dao.getUserByClientId(clientId);
        communicationHelper.sendEngageSubscribedEmail(userInfo);
        await dao.updateFeatureSubscription(clientId, constants.subscriptionType.ENGAGE);
        res.status(httpStatus.OK).json({ status: true })

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error occured during subscribing engage : ${error}`);
    }
}

