const brokerDao = require('../../dao/connect/broker')
const brokerHelper = require('../../helper/connect/broker')
const uploadHelper = require('../../helper/common/upload');
const enrollmentHelper = require('../../helper/common/enrollment');
const httpStatus = require('../../helper/utilities/http-status');
const messages = require('../../helper/utilities/messages');
const constants = require('../../helper/utilities/constants');
const model = require('../../models');
const errorLog = require('../../helper/common/logger').errorLog;
const crypto = require('crypto');
const authenticationDao = require('../../dao/common/authentication');
const moment = require('moment');
const axios = require('axios').default;

/**
     * @author Ashish Singh
     * @description Get Client Listing   
 */

module.exports.getClientList = async function (req, res) {

    try {
        let partnerIds;
        if (req.query.partnerTypeId != null) {
            partnerIds = await brokerDao.getPartnerIdsByType(req.query.partnerTypeId)
        }
        if (req.query.partnerId != null) {
            partnerIds = req.query.partnerId
        }

        let brokerListFilter = await brokerHelper.filterClientListing(req.query, partnerIds)
        let brokers = await brokerDao.getClientList(brokerListFilter.condition, brokerListFilter.searchQuery, req.query);
        let brokerCount = await brokerDao.getBrokerListCount(brokerListFilter.condition, brokerListFilter.searchQuery, req.query)
        res.status(httpStatus.OK).json({ brokersList: brokers, brokerCount: brokerCount })
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error Occur in Get Stikkum Client List: ${error}`);


    }


}

/**
 * @author ananda pratap singh
 * @description get users login data 
 */
module.exports.getUsersDataByClientId = async function (req, res) {
    try {
        let users = await brokerDao.getUsersDataByClientId(req.query.clientId)
        res.status(httpStatus.OK).json({ usersList: users })
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error Occur in Get Stikkum Client Users List: ${error}`);
    }
}


/**
 * @author Ashish Singh
 * @description Get client detail
 * @summary We fetch the client detail from different table
 */

module.exports.viewClientById = async function (req, res) {
    try {

        let viewClient = await brokerDao.viewClientById(req.params.id);
        let notes = await brokerDao.getNoteByClientId(req.params.id);
        let pricing = await brokerDao.getCurrentPricing(req.params.id);
        let paymentCred = await brokerDao.getPaymentCredByClientId(req.params.id);

        res.status(httpStatus.OK).json({ brokerInfo: viewClient, notes: notes, paymentCred: paymentCred, subscription: pricing })
    } catch (error) {


        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error Occur In Get Client Detail : ${error}`);
    }
}

/**
     * @author Ashish Singh
     * @description Add `Main Point` and `Address`    
 */

module.exports.addUser = async function (req, res) {

    try {
        let userObj = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            title: req.body.title,
            mobileNumber: req.body.mobileNumber,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            nmls: req.body.nmls,
            ownerLevel: req.body.ownerLevel,
            clientId: req.body.clientId,
            statusId: req.body.statusId,
            systemUserTypeId: req.body.systemUserTypeId
        }
        let addressObj = {
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            stateId: req.body.stateId,
            cityId: req.body.cityId,
            zipCode: req.body.zipCode,
        }
        transaction = await model.sequelize.transaction();
        await brokerDao.addUser(userObj, addressObj, transaction);
        await transaction.commit();
        res.status(httpStatus.OK).json({ message: messages.toastr.MAINPT_ADDED })

    } catch (error) {
        if (error) await transaction.rollback();
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error Occur In Editing User Information: ${error}`);
    }
}



/**
     * @author Ashish Singh
     * @description Edit User For `Personal` And `Main Point` and `Address` Table   
 */

module.exports.editUser = async function (req, res) {

    try {
        let userObj = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            title: req.body.title,
            mobileNumber: req.body.mobileNumber,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            nmls: req.body.nmls
        }
        let addressObj = {
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            stateId: req.body.stateId,
            cityId: req.body.cityId,
            zipCode: req.body.zipCode,
        }
        await brokerDao.editUserById(userObj, req.body.userId);
        await brokerDao.editAddressById(addressObj, req.body.addressId);
        res.status(httpStatus.OK).json({ message: messages.toastr.INFO_UPDATED })
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error Occur In Editing User Information: ${error}`);
    }
}



/**
     * @author Ashish Singh
     * @description Edit Client Details  
 */

module.exports.updateClientById = async function (req, res) {

    let transaction
    try {
        transaction = await model.sequelize.transaction();
        let mainObj = {}
        let clientObj = {
            legalName: req.body.legalName,
            dbaName: req.body.dbaName,
            federalTaxId: req.body.federalTaxId,
            bussinessClassificationTypeId: req.body.bussinessClassificationTypeId,
            locationType: req.body.locationType,
            phoneNumber: req.body.phoneNumber,
            website: req.body.website,
            email: req.body.email,
            fax: req.body.fax,
            nmls: req.body.nmls,
            clientTypeId: req.body.clientTypeId,
            clientTypeName: req.body.clientTypeName,
            yearsOld: req.body.yearsOld,
            loCount: req.body.loCount,
            loansUnderManagement: req.body.loansUnderManagement
        }
        let addressObj = {
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            stateId: req.body.stateId,
            cityId: req.body.cityId,
            zipCode: req.body.zipCode
        }

        mainObj.clientObj = clientObj;
        mainObj.clientId = req.body.clientId;
        mainObj.addressObj = addressObj;
        mainObj.addressId = req.body.addressId;

        await brokerDao.updateClientById(mainObj, transaction);
        res.status(httpStatus.OK).json({ message: messages.toastr.EDIT_CLIENT })
        await transaction.commit();
    } catch (error) {
        if (error) await transaction.rollback();
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur in Client Details Edit  : ${error}`);
    }
}
/**Updating Partner Id */

module.exports.updateClientPartnerById = async function (req, res) {
    let transaction
    try {
        transaction = await model.sequelize.transaction();     
        await brokerDao.updateClientPartnerById(JSON.parse(req.body.data), req.params.id,transaction)
        res.status(httpStatus.OK).json({ message: messages.toastr.PARTNER_ADDED })
        await transaction.commit();
    } catch (error) {
        if (error) await transaction.rollback();
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error Occur in Updating Partner : ${error}`);
    }


}

/**
     * @author Ashish Singh
     * @description  Fetch All The Notes Of The Clients
 */

module.exports.getNoteByClientId = async function (req, res) {
    try {

        let notes = await brokerDao.getNoteByClientId(req.params.id)
        res.status(httpStatus.OK).json(notes)
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur in Get Notes : ${error}`);
    }
}


/**
     * @author Ashish Singh
     * @description  Add Notes
 */


module.exports.addNotes = async function (req, res) {
    try {

        await brokerDao.addNotes(req.body);
        res.status(httpStatus.OK).json({ message: messages.toastr.ADD_NOTES })
    }
    catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur In Add Notes Successfully : ${error}`);
    }
}

/**
     * @author Ashish Singh
     * @description  Update Notes
 */


module.exports.updateNoteById = async function (req, res) {
    try {

        await brokerDao.updateNoteById(req.body.description, req.params.id);
        res.status(httpStatus.OK).json({ message: messages.toastr.UPDATE_NOTES })
    } catch (error) {

        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur In Update Notes Key : ${error}`);
    }
}

/**
     * @author Ashish Singh
     * @description Delete Notes
 */


module.exports.deleteNoteById = async function (req, res) {
    try {
        await brokerDao.deleteNoteById(req.params.id)
        res.status(httpStatus.OK).json({ message: messages.toastr.DELETE_NOTES })
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur In Deleted Notes: ${error}`);
    }
}

/**
     * @author Ashish Singh
     * @description Add Branch Information
 */

module.exports.addBranchInfo = async function (req, res) {

    try {
        req.body.token = crypto.randomBytes(16).toString('hex');
        await brokerDao.addBranchInfo(req.body);
        brokerHelper.newSiteAddedEmail(req.body.billingEntity, req.body.token, req.body.email);
        res.status(httpStatus.OK).json({ message: messages.toastr.NEW_ACCOUNT_ADDED })
    } catch (error) {

        res.status(500).json({ status: false })
        errorLog.error(`Error Occur in Additional Site Inspection : ${error}`);
    }
}

/**
 * Delete `Branch` Info
 */



module.exports.deleteBranchInfoById = async function (req, res) {

    try {
        await brokerDao.deleteBranchInfoById(req.params.id);
        res.status(httpStatus.OK).json({ message: messages.toastr.NEW_ACCOUNT_DELETED })
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur In Delete Additional Site Inspection: ${error}`);
    }
}


module.exports.updatePaymentById = async function (req, res) {

    try {
        let mainObj = {};
        let paymentObj = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
        }
        let addressObj = {
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            stateId: req.body.stateId,
            cityId: req.body.cityId,
            zipCode: req.body.zipCode,
        }
        mainObj.paymentObj = paymentObj;
        mainObj.addressObj = addressObj;
        mainObj.paymentCredId = req.body.paymentCredId
        mainObj.addressId = req.body.addressId;
           
        transaction = await model.sequelize.transaction();
        await brokerDao.updatePaymentById(mainObj, transaction);
        await transaction.commit();
        res.status(httpStatus.OK).json({ message: messages.toastr.EDIT_PAYMENT })


    } catch (error) {
        if (error) await transaction.rollback();
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur in Payment Details Edit  : ${error}`);
    }

}



module.exports.updatePricing = async function (req, res) {
    let transaction
    try {
        let mainObj = {};

        let data = JSON.parse(req.body.data);
        

        let pricingObj = {
            partnerId: data.partnerId,
            pricingHeadId: data.pricingHeadId,
            value1: data.value1,
            value2: data.value2,
            value3: data.value3,
            value4: data.value4,
            value5: data.value5,
            isCurrent: true,
            isSpecial: data.isSpecial
        }
        let clientObj = {
            clientId: data.clientId,
            partnerId: data.partnerId
        }

        let pricingId = data.id;
        mainObj.pricingObj = pricingObj;
        mainObj.clientObj = clientObj;
        mainObj.pricingId = pricingId;

        transaction = await model.sequelize.transaction();
        childClientIds = [];
        let getChildClient = await brokerDao.clientBranchDetails(mainObj.clientObj.clientId);
        getChildClient = JSON.parse(JSON.stringify(getChildClient))
        for (let i = 0; i < getChildClient.length; i++) {
            childClientIds.push(getChildClient[i].id);
        }
        mainObj.childClientIds = childClientIds;
         
        await brokerDao.updateTransactionPrice(mainObj, transaction);
        res.status(httpStatus.OK).json({ message: messages.toastr.PRICING_UPDATED })
        await transaction.commit();
    } catch (error) {
        if (error) await transaction.rollback();
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur in Add Alert Amount  : ${error} `);

    }
}


/**
     * @author Ashish Singh
     * @description  Get Pricing History
 */

module.exports.getPricingHistory = async function (req, res) {

    let transaction
    try {
        transaction = await model.sequelize.transaction();
        let getPricingHistory = await brokerDao.getPricingHistory(req.params.clientId, transaction);
        res.status(httpStatus.OK).json(getPricingHistory);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur in Getting  Transaction History: ${error}`);
    }
}

module.exports.requestAdditionalDocuments = async function (req, res) {
    let transaction
    try {

        let users = await brokerDao.getPrimaryAndSecondaryUser(req.body.clientId);

        let tokenObj = {};
        let email = [];
        tokenObj.token = crypto.randomBytes(16).toString('hex');
        tokenObj.purpose = req.body.purpose;

        // Create token for personal as well as main point;

        for (i = 0; i < users.length; i++) {

            email.push(users[i].email)

            tokenObj.userId = users[i].id;
            await authenticationDao.saveUserToken(tokenObj);

        }

        brokerHelper.sendRequestDocumentEmail(email, req.body.remarks, tokenObj.token);
        res.status(httpStatus.OK).json({ message: messages.toastr.REQ_DOC })

    } catch (error) {
        if (error) await transaction.rollback();
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occured Request Additional Documents  ${error}`);
    }


}

module.exports.updateFeatureSubscription = async function (req, res) {

    let data = JSON.parse(req.body.data);
    let subscriptionObj = { subscribed: data.subscribed }
    if (data.subscribed) {
        subscriptionObj.subscribedDate = moment().utc().format('YYYY-MM-DD');
    }
    await brokerDao.updateFeatureSubscription(subscriptionObj, data.clientId, data.subscriptionTypeId)

    if (data.subscriptionTypeId == constants.subscriptionType.ENGAGE) {
        if (data.subscribed) {
            res.status(httpStatus.OK).json({ message: messages.toastr.ENGAGE_SUBSCRIBED })
        }
        else {
            res.status(httpStatus.OK).json({ message: messages.toastr.ENGAGE_UNSUBSCRIBED })
        }

    }

    if (data.subscriptionTypeId == constants.subscriptionType.FICO) {
        if (data.subscribed) {
            res.status(httpStatus.OK).json({ message: messages.toastr.FICO_SUBSCRIBED })
        }
        else {
            res.status(httpStatus.OK).json({ message: messages.toastr.FICO_UNSUBSCRIBED })
        }
    }



}

module.exports.uploadSiteInspection = async function (req, res) {
    try {


        let localPath = req.files[0].path
        let remotepath = CONFIG.COMPLAYTRAQ_DOCUMENT + req.body.clientId + '/' + req.files[0].originalname

        paths = [{ local: localPath, remote: remotepath }];

        let inspectionObj = {
            inspectedOn: moment().utc().format('YYYY-MM-DD'),
            resultFileName: req.files[0].originalname,
            statusId: constants.status.RECEIVED
        }

        await uploadHelper.distributeProcessAndUploadFiles(paths);
        brokerDao.updateComplyTraqDocDetails(inspectionObj, req.body.clientId)


        res.status(httpStatus.OK).json({ message: messages.toastr.SITEINSPECTION_DOCUMENT_UPLOADED });
    }
    catch (error) {

        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur While Site Inspection : ${error}`);
    }
}



module.exports.updateEnrollmentStatus = async function (req, res) {
    try {

        var clientId = req.params.id;

        // for suspennd or close change the borrrower status ToDelete
        if (req.body.statusId == constants.status.INACTIVE || req.body.statusId == constants.status.CLOSED) {
            let statusObj = {
                statusId: constants.status.TO_DELETE
            }
            await brokerDao.updateBorrowerStatus(statusObj, clientId);
        }

        let isIsvClient = await brokerDao.isIsvClient(clientId);

        let message = messages.toastr.CLIENT_STATUS_UPDATED
        if (!isIsvClient) {

            await brokerDao.updateEnrollmentStatus(req.body, clientId);

            if (req.body.statusId == constants.status.APPROVED || req.body.statusId == constants.status.APPROVED_SITE_INSPECTION_PENDING || req.body.statusId == constants.status.INACTIVE || req.body.statusId == constants.status.REJECTED || req.body.statusId == constants.status.CLOSED) {

                let users = await brokerDao.getPrimaryAndSecondaryUser(clientId);

                for (i = 0; i < users.length; i++) {
                    emailObj = {};
                    if (req.body.statusId == constants.status.APPROVED || req.body.statusId == constants.status.APPROVED_SITE_INSPECTION_PENDING) {
                        let tokenObj = {};
                        tokenObj.purpose = req.body.purpose;
                        tokenObj.token = crypto.randomBytes(16).toString('hex');
                        tokenObj.userId = users[i].id;
                        await authenticationDao.saveUserToken(tokenObj);
                        emailObj.token = tokenObj.token;
                    }
                    emailObj.email = users[i].email;
                    emailObj.statusId = req.body.statusId;

                    brokerHelper.sendEnrolledStatusEmail(emailObj)
                }
            }
        } else {

            let callbackUrls = await brokerDao.getIsvEndpointUrls(isIsvClient);
            if (callbackUrls) {
                message = messages.toastr.CLIENT_STATUS_UPDATED
                let isvEnrollStatus = await brokerDao.getIsvClientEnrollStatus(clientId);
                let requestPayload = {
                    status: req.body.statusId == constants.status.APPROVED ? 'Approved' : 'Rejected',
                    token: isvEnrollStatus.token
                }

                if (req.body.statusId == constants.status.REJECTED) requestPayload.remarks = req.body.remarks;
                if (req.body.statusId == constants.status.APPROVED || req.body.statusId == constants.status.REJECTED) {
                    let postResult = await enrollmentHelper.postRequest(callbackUrls.enrollStatusUrl, callbackUrls.callbackApiKey, 'POST', requestPayload);

                    await brokerDao.updateEnrollmentStatus(req.body, clientId);

                    await brokerDao.logStatusPushedResult({
                        partnerId: isIsvClient,
                        clientId: clientId,
                        statusId: postResult.data.status ? constants.status.SENT : constants.status.FAILED,
                        enrollStatus: requestPayload.status,
                        type: constants.isvNotificationType.ENROLLMENT
                    });


                }

            } else {
                brokerHelper.sendIsvErrorEmail('Enrollment Status Not Pushed', 'Endpoints Not Registered')
                return res.status(httpStatus.BAD_REQUEST).json({ message: messages.toastr.ENDPOINTS_NOT_REGISTERED })
            }
        }
        res.status(httpStatus.OK).json({ message: message })
        axios.post(CONFIG.JOBS_SERVER_BASE_URL + 'reload-flat-data', {});
    }
    catch (error) {
        brokerHelper.sendIsvErrorEmail('Error Occur in Enrollment Verification', error)
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur in Enrollment Verification : ${error}`);

    }
}




/**
     * @author Amit kumar
     * @description Delete client Details  
 */

module.exports.deleteClient = async function (req, res) {
    let transaction
    try {

        transaction = await model.sequelize.transaction();
        await brokerDao.deleteClient(req.query.clientId, req.query.parentId, transaction);
        res.status(httpStatus.OK).json({ message: messages.toastr.DELETE_CLIENT })
        await transaction.commit();
        axios.post(CONFIG.JOBS_SERVER_BASE_URL + 'reload-flat-data', {});
    } catch (error) {
        if (error) await transaction.rollback()
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error Occur In Delete Client Successfully : ${error}`);
    }
}

/**
 * @author Amit kumar
 * @description Get  branch client detail
 * @summary We fetch the branch client detail from different table
 */

module.exports.clientBranchDetails = async function (req, res) {

    try {
        let getChildClient = await brokerDao.clientBranchDetails(req.query.clientId);
        res.status(httpStatus.OK).json({ data: getChildClient, message: messages.toastr.GET_CLIENT_DETAILS })
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error Occur In Get Branch Client Detail : ${error}`);
    }

}

/**
     * @author Amit kumar
     * @description Upload Profile Picture  
 */

module.exports.profilePicture = async function (req, res) {

    try {
        /** 
         * Return 400 if the required parameters are not provided.
         */
        if (!req.body.userId) {
            res.status(400).json({ message: 'Invalid Parameter' });
            return;
        }
        /**
         * Get local and remote file paths. 
         */
        let paths = [];
        req.files.forEach(file => {
            let remote = `${CONFIG.USER_PROFILE_PIC_PATH}${req.body.userId}/${req.files[0].filename}`;
            paths.push({ local: req.files[0].path, remote: remote, filename: req.files[0].originalname, })


        });
        //Upload file in S3

        await uploadHelper.distributeProcessAndUploadFiles(paths)

        /**
         * Save the file details to db;
         */
        let docInfoInsertPromises = [];
        paths.forEach(path => {
            let profilePicPath = path.remote.split('/');
            let docInfo = {
                userId: req.body.userId,
                profilePicName: profilePicPath[profilePicPath.length - 1]
            }
            /*Save details in brokerDao*/
            docInfoInsertPromises.push(brokerDao.profilePicture(docInfo))

        })
        await Promise.all(docInfoInsertPromises);
        /*Remove the token from the table*/
        await brokerHelper.createVersionsOfImage(req, res);
        res.status(httpStatus.OK).json({ message: messages.toastr.PROFILE_PICTURE, picName: req.files[0].filename })
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error Occured In Upload Profile picture: ${error}`);
    }

}






module.exports.updateAdditionalSiteInspection = async function (req, res) {
    try {
        await brokerDao.updateAdditionalSiteInspection(req.body.id, req.body);
        res.status(httpStatus.OK).json({ message: messages.toastr.EDIT_SITE_INSPECTION })
    } catch (error) {


        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur In Additional Site Inspection: ${error}`);
    }
}

/**
     * @author Amit kumar
     * @description   Delete Profile
 */
exports.deleteProfilePicture = async function (req, res) {

    try {
        await brokerDao.deleteProfilePictures(req.body.id)
        await uploadHelper.deleteFolderFromAwsS3(req.body.folderPath);
        res.status(httpStatus.OK).json({ message: messages.toastr.DELETE_PROFILE })
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur In Deleted Broker Profile Picture: ${error}`);
    }
}


/**
     * @author Amit kumar
     * @description  Get Acces Log Deatil
 */
// module.exports.accessLog = async function (req, res) {
//     try {
//         var additionalSite = req.body;
//         var gentoken = crypto.randomBytes(16).toString('hex');
//         additionalSite.token = gentoken
//         additionalSite.status = constants.status.INPROGRESS
//         email = req.body.email

//         if (req.body.billingEntity == 'S') {
//             let url = CONFIG.SERVER_BASE_URL + 'samebillingenroll/' + gentoken;


//             let email1 = {
//                 to: email,
//                 from: CONFIG.SMTP.SENDER,
//                 subject: 'Stikkum | Add New Account'
//             }


//             let emailRes1 = await emailHelper.sendMail(email1, { url: url }, 'AdditionalInspectionToNewEmail');

//             await brokerDao.additionalSiteInspection(additionalSite, req.body.clientId);

//             res.status(200).json({ status: true })
//         }
//         else  //Billing Entity Different
//         {
//             let url = CONFIG.SERVER_BASE_URL + 'differentbillingenroll/' + gentoken;
//             let email1 = {
//                 to: email,
//                 from: CONFIG.SMTP.SENDER,
//                 subject: 'Stikkum | Add New Account'
//             }

//             emailRes1 = await emailHelper.sendMail(email1, { url: url }, 'AdditionalInspectionToNewEmail');

//             await brokerDao.additionalSiteInspection(additionalSite, req.body.clientId);
//             res.status(200).json({ status: true })
//         }

//         await brokerDao.deleteProfilePictures(req.body.clientId)

//         await uploadHelper.deleteToAwsS3(req.body.profilePicRemotePath + messages.imageSize.THUMB);
//         await uploadHelper.deleteToAwsS3(req.body.profilePicRemotePath + messages.imageSize.SMALL);
//         await uploadHelper.deleteToAwsS3(req.body.profilePicRemotePath + messages.imageSize.MEDIUM);
//         await uploadHelper.deleteToAwsS3(req.body.profilePicRemotePath + messages.imageSize.LARGE);

//         res.status(httpStatus.OK).json({ message: messages.toastr.DELETE_PROFILE })
//     } catch (error) {
//         res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
//         errorLog.error(`Error Occur In Deleted Broker Profile Picture: ${error}`);
//     }
// }



/***************partner list************** */

module.exports.getPartnerListByType = async function (req, res) {

    try {


        let getPartnerListDetails = await brokerDao.getPartnerListDetails(req.query.systemUserTypeId, req.query.partnerId);

        res.status(httpStatus.OK).json({ message: messages.toastr.GET_PARTNER_DETAILS, Data: getPartnerListDetails })

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur In GEt Additional Site Inspection Data Successfully : ${error}`);
    }
}


module.exports.getClientInfoForTemplate = async function (req, res) {
    try {
        let client = await brokerDao.getClientInfoForTemplate(req.query.clientId);
        client = brokerHelper.restructureClientInfoDataForTemplate(client)
        res.status(httpStatus.OK).json(client)
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error occurred while fetching client info for template: ${error}`);
    }
}

/**
     * @author Anveshika Srivastava
     * @description  Delete document
 */

module.exports.deleteDocumentById = async function (req, res) {

    try {
        await brokerDao.deleteDocumentById(req.params.id);
        res.status(httpStatus.OK).json({ message: messages.toastr.DELETE_DOCUMENT })
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur In Delete Additional Site Inspection: ${error}`);
    }
}
