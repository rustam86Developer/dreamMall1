
const bcrypt = require('bcrypt');
const brokerdao = require('../../dao/connect/broker')
const paymentDao = require('../../dao/connect/payment');
const paymentHelper = require('../../helper/connect/payment');
const messages = require('../../helper/utilities/messages');
const httpStatus = require('../../helper/utilities/http-status');
const errorLog = require('../../helper/common/logger').errorLog;
const constants = require('../../helper/utilities/constants');
const authenticationDao = require('../../dao/common/authentication');
const saltRounds = 10;
const model = require('../../models');
/**
 * add Card Details
 */

module.exports.addCardDetails = async function (req, res) {
    mainObj = req.body.data;
    mainObj = JSON.parse(mainObj);
     

    try {

        if (!mainObj.paymentObj.sameAsPrevious) {
            let transactionInfo = await paymentHelper.ascertainPaymentMode(mainObj.paymentObj.paymentType, mainObj.paymentObj);

            let addToVault = await paymentHelper.addToVault(transactionInfo, mainObj.paymentPayload);

            let vaultId = addToVault.customer_vault_id;
            /*************this is used for sending mail to user************** */
            if (addToVault.response_code == httpStatus.VELOX_SUCCESS) {

                mainObj.paymentCredObj.vaultId = vaultId
                await paymentDao.addcardDetails(mainObj);

                if (mainObj.adminChangesClientData.adminEditObj) {
                    let getUserDetails = await brokerdao.getUserDetails(mainObj.paymentObj.clientId);
                    await paymentHelper.sendInfoEditEmailToBroker(getUserDetails,mainObj.adminChangesClientData.moduleName)

                }

                res.status(httpStatus.OK).json({ message: messages.toastr.ADD_PAYMENT })

            }
            else{
                res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.ADD_PAYMENT_ERROR })
            }



        }
        /************************billing address same as previous***************************** */
        else {
            let billingDetails = await paymentDao.getbillingdetail(mainObj.paymentObj.clientId);


            var addressId = billingDetails.dataValues.Addresses[0].dataValues.id;

            let billingObject = await paymentHelper.getDataObj({ paymentCredObj: mainObj.paymentCredObj, paymentObj: mainObj.paymentObj, billingDetails: billingDetails });

            let transactionInfo = await paymentHelper.ascertainPaymentMode(mainObj.paymentObj.paymentType, mainObj.paymentObj);
            
            let addToVault = await paymentHelper.addToVault(transactionInfo, billingObject.paymentPayload);
           
            if (addToVault.response_code ==  httpStatus.VELOX_SUCCESS) {

                billingObject.cardDetailObj.vaultId = addToVault.customer_vault_id
                await paymentDao.addcardDetails(mainObj, billingObject.cardDetailObj, addressId);

                if (mainObj.adminChangesClientData.adminEditObj) {
                    let getUserDetails = await brokerdao.getUserDetails(mainObj.paymentObj.clientId);
                    await paymentHelper.sendInfoEditEmailToBroker(getUserDetails, mainObj.adminChangesClientData.moduleName)

                }

                res.status(httpStatus.OK).json({ message: messages.toastr.ADD_PAYMENT })
            }
            else{
                res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.ADD_PAYMENT_ERROR })
            }

        }

    } catch (error) {

        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })

        errorLog.error(`Error occured while get card details : ${error},`);
    }

}
/**
 * Get billing Card Details
 */
module.exports.getbillingdetail = async function (req, res) {

    try {
        let getbillingdetail = await paymentDao.getbillingdetail(req.params.clientId);
        res.status(httpStatus.OK).json({ data: getbillingdetail })

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error occured while get card details : ${error},`);
    }
}


/**
 * Get Client Card Details
 */
module.exports.getCardDetails = async function (req, res) {
    try {

        let getCardDetails = await paymentDao.getCardDetails(req.params.clientId);
        res.status(httpStatus.OK).json({ data: getCardDetails })

    } catch (error) {

        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })

        errorLog.error(`Error occured while get card details : ${error},`);
    }
}

/**
 * Update Primary Key
 */
module.exports.updatePrimaryCard = async function (req, res) {

    try {
        if (req.body.modifiedFields.adminEditObj == "true") {
            let getUserDetails = await brokerdao.getUserDetails(req.body.clientId);
            await paymentHelper.sendInfoEditEmailToBroker(getUserDetails, req.body.modifiedFields.moduleName)
        }

        let updateDetail = await paymentDao.updatePrimaryCard(req.params.paymentCredentialId, req.body.clientId);
        res.status(httpStatus.OK).json({ updateDetail: updateDetail, message: messages.toastr.UPDATED_CARD })
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error occured while updating preferences : ${error},`);
    }
}

/**
 * Delete Card Details
 */
module.exports.deleteCardDetails = async function (req, res) {
    try {

        // get card details
        let cardData = await paymentDao.cardData(req.params.paymentCredentialId);
        let deleteFromVault = await paymentHelper.deleteFromVault(cardData.vaultId);
        if (deleteFromVault.response_code == 100) {
            //delete card details from database
            await paymentDao.deleteCardDetails(req.params.paymentCredentialId);
            res.status(httpStatus.OK).json({ message: messages.toastr.CARD_DELETE });
        } else {

            res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
            errorLog.error(`Error occured in delete card details: ${error}`);
        }
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error occured while deleteing Card : ${error}`);
    }
}
/**
 * Add ISV partner card detail 
 */
exports.addISVpayment = async function (req, res) {
    let transaction;
    try {
        transaction = await model.sequelize.transaction();
        mainObj = req.body;

        /** Get partner Id*/
        var validToken = await authenticationDao.checkIfValidToken(mainObj.userObj.token);
        if (!validToken) {
            return res.status(httpStatus.NOT_FOUND).json({ message: messages.toastr.LINK_EXPIRED })
        }
        var userId = validToken.userId;
        partnerData = await paymentDao.partnerDataByUserId(userId);

        /** Add vault id*/
        let transactionInfo = await paymentHelper.ascertainPaymentMode(mainObj.paymentObj.paymentType, mainObj.paymentObj);
        // add Vault
        let vaultData = await paymentHelper.addToVault(transactionInfo, mainObj.paymentPayload);

        if (vaultData.response_code == constants.payment.SUCCESS) {
            mainObj.paymentCredObj.vaultId = vaultData.customer_vault_id
            mainObj.paymentCredObj.partnerId = partnerData.partnerId
            mainObj.paymentCredObj.email = partnerData.email
            mainObj.paymentCredObj.firstName = partnerData.firstName
            mainObj.paymentCredObj.lastName = partnerData.lastName
            mainObj.paymentCredObj.phoneNumber = partnerData.phoneNumber
            /** add card details */
            await paymentDao.addPartnerCard(mainObj.paymentCredObj, transaction);
            /** create partner password*/
            let createPassword = await bcrypt.hash(mainObj.userObj.password, saltRounds);
            let result = await paymentDao.completeRegistration(createPassword, userId, transaction);
            if (result) {
                await authenticationDao.destroyUserToken(req.body.userObj.token);
            }
        }
        else {
            return res.status(httpStatus.BAD_REQUEST).json({ message: messages.toastr.PAYMENT_FAILED })
        }

        await transaction.commit();
        res.status(httpStatus.OK).json({ message: messages.toastr.CREATE_PASS })
    } catch (error) {
        transaction.rollback();
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error Occured in Add Card Details: ${error}`);

    }
}
