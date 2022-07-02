const errorLog = require('../../helper/common/logger').errorLog;
const enrollmentDao = require('../../dao/common/enrollment');
const httpStatus = require('../../helper/utilities/http-status');
const messages = require('../../helper/utilities/messages');
const enrollmentHelper = require('../../helper/common/enrollment');
const uploadHelper = require('../../helper/common/upload');
const constants = require('../../helper/utilities/constants');
const paymentHelper = require('../../helper/connect/payment');
const model = require('../../models');
const authenticationDao = require('../../dao/common/authentication');

/**
   * @author Ashish Singh
   * @description This function is for inserting data into multiple table to add enrollment
   * @todo Payment function and Isv Check.
   *
 */


module.exports.addEnrollment = async function (req, res) {
    let transaction
    try {
        transaction = await model.sequelize.transaction();
        let mainObj = req.body.data;
        mainObj = JSON.parse(mainObj);

        if (mainObj.clientObj.paidByClient) {

            let transactionInfo = await paymentHelper.ascertainPaymentMode(mainObj.paymentObj.paymentType, mainObj.paymentObj);
            let addToVault = await paymentHelper.addToVault(transactionInfo, mainObj.paymentPayload);
            let vaultId = addToVault.customer_vault_id;
            let deductAmount = await paymentHelper.makeTransaction(mainObj.paymentObj.amount, vaultId);
            mainObj.paymentCredObj.vaultId = vaultId;

            if (deductAmount.response_code != constants.payment.SUCCESS) {
                return res.status(httpStatus.BAD_REQUEST).json({ message: messages.toastr.PAYMENT_FAILED })
            }

        }

        let backUpData = req.body;

        delete backUpData.paymentObj;

        await enrollmentHelper.createDataBackup(backUpData, messages.backUp.ENROLLMENT_BACKUP);
        let clientId = await enrollmentDao.addEnrollment(mainObj,transaction);
       
        if (!mainObj.clientObj.isISV) {
            enrollmentHelper.sendEnrollmentCompleteEmail(mainObj);
            enrollmentHelper.sendSubscribedServicesEmail(mainObj);       
        }
        res.status(httpStatus.OK).json({ message: messages.toastr.PAYMENT_SUCCESSFUL, clientId: clientId });
        await transaction.commit();

    } catch (error) {
       
        await transaction.rollback();
        enrollmentHelper.sendEnrollmentErrorEmail(error);
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur While Enrolling Client : ${error}`);
    }
}


module.exports.addSameBillingEnrollment = async function (req, res) {
    let transaction
    try {
        transaction = await model.sequelize.transaction();
        let mainObj = req.body.data;
        mainObj = JSON.parse(mainObj)

        let backUpData = req.body;

        await enrollmentHelper.createDataBackup(backUpData, messages.backUp.ENROLLMENT_BACKUP);
        let clientId = await enrollmentDao.addSameBillingEnrollment(mainObj, transaction);

        res.status(httpStatus.OK).json({ clientId: clientId });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        enrollmentHelper.sendEnrollmentErrorEmail(error);
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur While Enrolling Client : ${error}`);
    }

}

/**
    * @author Ashish Singh
    * @description  Create backup and add additional site inspection data at the time of enrollment.
    
*/

module.exports.addSiteInspection = async function (req, res) {
    try {
        let message;
        if (req.body.inspectionType == 'true') {
            message = messages.toastr.INSPECTION_INFO_UPDATED;
        } else {
            messages.toastr.INSPECTION_INFO_SAVED;
        }

        let inspectionObj = req.body.inspectionInfoObject;

        Object.keys(inspectionObj).forEach(key => {
            if (inspectionObj[key] == '') {
                inspectionObj[key] = null;
            }
        })

        await enrollmentHelper.createDataBackup(req.body, 'SiteInspectionBackup');
        await enrollmentDao.addSiteInspection(inspectionObj, req.body.clientId);
        await enrollmentDao.getInfoForComplyTraq(req.body.clientId);
        let clientInfo = await enrollmentDao.getInfoForComplyTraq(req.body.clientId);
        enrollmentHelper.sendInfoToComplyTraq(clientInfo, inspectionObj)
        res.status(httpStatus.OK).json({ message: message })

    }
    catch (error) {

        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur While Site Inspection : ${error}`);
    }
}


/**
    * @author Ashish Singh
    * @description  Upload enrollment document - Same function can be used in request additional document and view client.
*/

module.exports.uploadEnrollmentDocument = async function (req, res) {

    try {
        var paths = [];
        var docInfo = [];
        req.files.forEach(file => {
            let remote = CONFIG.ENROLLMENT_DOCUMENT + req.body.clientId + '/' + file.originalname
            paths.push({ local: file.path, remote: remote, filename: file.originalname, type: file.docType })
            docInfo.push({ clientId: req.body.clientId, name: file.originalname, statusId: constants.status.RECEIVED, path: file.originalname, type: file.docType })

        });
 
        await uploadHelper.distributeProcessAndUploadFiles(paths);
        await enrollmentDao.saveEnrollmentDocument(docInfo)
        if (req.body.token) {
            await authenticationDao.destroyUserToken(req.body.token);
        }
        res.status(httpStatus.OK).json({ message: messages.toastr.UPLOAD_DOCUMENT });
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur while Uploading File : ${error}`);
    }

}

/**
     * @author Ashish Singh
     * @description  Fetch pricing for multiple condition .
     
 */
module.exports.getPricing = async function (req, res) {
    try {
        let pricingConditions = await enrollmentHelper.managePricingConditions(req.query);
        let pricing = await enrollmentDao.getPricing(pricingConditions);
        let defaultPricing = await enrollmentDao.getDefaultPricing();
        return res.status(httpStatus.OK).json({ pricing, defaultPricing })
    } catch (error) {

        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error occur while get pricing info : ${error}`);
    }

}

/**
     * @author Ashish Singh
     * @description  Fetch  Partner By Link Extension.   
 */

module.exports.getPartnerByLinkExtension = async function (req, res) {

    try {
        let partnerData = await enrollmentDao.getPartnerByLinkExtension(req.params.linkExt);

        if (!partnerData) {
            return res.status(httpStatus.NOT_FOUND).json({ messages: messages.toastr.LINK_EXT_NOT_FOUND })
        }
        return res.status(httpStatus.OK).json(partnerData)

    } catch (error) {

        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur While Fetching Partner Data : ${error}`);
    }

}

/**
     * @author Ashish Singh
     * @description  Fetch Special Link Info.
     
 */
module.exports.getSpecialLinkInfo = async function (req, res) {

    try {

        let specialEnroll = await enrollmentDao.getSpecialLinkInfo(req.params.specialLink);
        if (!specialEnroll) {
            return res.status(httpStatus.NOT_FOUND).json({ message: messages.toastr.LINK_EXT_NOT_FOUND })
        }
        return res.status(httpStatus.OK).json(specialEnroll)

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur while fetching special link info : ${error}`);
    }

}

/**
     * @author Ashish Singh
     * @description  Fetch ISV Temporary Data with partner details.   
*/

module.exports.getISVTempData = async function (req, res) {

    try {
        let tempData = await enrollmentDao.getISVTempData(req.params.token);
        if (!tempData) {
            return res.status(httpStatus.NOT_FOUND).json({ message: messages.toastr.INVALID_TOKEN })
        }
        return res.status(httpStatus.OK).json(tempData)

    } catch (error) {

        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occured While Getting ISV Temp Data : ${error}`);
    }

}

/**
    * @author Ashish Singh
    * @description  Fetch PartnerId By Token.
    
*/
module.exports.getParentIdByToken = async function (req, res) {
    try {
        let client = await enrollmentDao.getParentIdByToken(req.params.token);
        let pricing = await enrollmentDao.getPricingByClientId(client.clientId);

        if (!client) {
            return res.status(httpStatus.NOT_FOUND).json({ message: messages.toastr.INVALID_TOKEN })
        }
        return res.status(httpStatus.OK).json(pricing)

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occured While Getting ISV Temp Data : ${error}`);
    }

}


/**
     * @author Ashish Singh
     * @description  Fetch Landing Page Info.
*/

module.exports.getLandingPageInfo = async function (req, res) {

    try {
        let landingPage = await enrollmentDao.getLandingPageInfo(req.params.linkExtension);

        if (!landingPage) {
            return res.status(httpStatus.NOT_FOUND).json({ messages: messages.toastr.LINK_EXT_NOT_FOUND })
        }
        return res.status(httpStatus.OK).json(landingPage)

    } catch (error) {

        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur While Getting Landing Page Info: ${error}`);
    }

}

/**
     * @author Ashish Singh
     * @description  Save contactus details.This function can be reused for Help and Referral.
     
 */


module.exports.saveContactUs = async function (req, res) {
    try {

        let contactUsObj = req.body;
        if (req.body.linkExtension) {
            contactUsObj.token = req.body.linkExtension
        }
        await enrollmentDao.saveContactUs(contactUsObj);
        enrollmentHelper.sendContactUsEmail(contactUsObj);
        return res.status(httpStatus.OK).json({ message: messages.toastr.SUBMIT_QUERY })
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur while  Saving Contact information: ${error}`);
    }
}

module.exports.getClientType = async function (req, res) {
    try {

        let clientTypes = await enrollmentDao.getClientType();
        res.status(httpStatus.OK).json(clientTypes);

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur while  fetching Client Type In Enrollment Form: ${error}`);
    }
}

module.exports.getBusinessClassification = async function (req, res) {
    try {

        let businessClassfication = await enrollmentDao.getBusinessClassification();

        res.status(httpStatus.OK).json(businessClassfication);

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur while  fetching Business Classification Type In Enrollment Form: ${error}`);
    }
}

