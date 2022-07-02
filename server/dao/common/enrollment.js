const model = require('../../models');
const constants = require('../../helper/utilities/constants');

exports.addEnrollment = async function (data, transaction) {

    let clientData = await model.Client.create(data.clientObj, { transaction });
    data.userPrimaryObj.clientId = clientData.id;
    data.userSecondaryObj.clientId = clientData.id;
    data.paymentCredObj.clientId = clientData.id;
    data.paymentHistoryObj.clientId = clientData.id;
    data.clientPricingObj.clientId = clientData.id;
    data.ISVEnrollObj.clientId = clientData.id;
    data.preferenceObj.clientId = clientData.id;
    data.siteInspectionObj.clientId = clientData.id;

    let user = await model.User.create(data.userPrimaryObj, { transaction });

    if (data.clientObj.mainPtContact) {
        var mainPt = await model.User.create(data.userSecondaryObj, { transaction });
    }

    if (data.pricingObj) {
        var pricing = await model.Pricing.create(data.pricingObj, { transaction });
        data.clientPricingObj.pricingId = pricing.dataValues.id
        data.paymentHistoryObj.pricingId = pricing.dataValues.id
    }

    await model.ClientPricing.create(data.clientPricingObj, { transaction });

    // Check for isv payment mode [`SELF` or `CLIENT`] 
    if (data.clientObj.paidByClient) {
        var paymentCred = await model.PaymentCredential.create(data.paymentCredObj, { transaction });
        data.paymentHistoryObj.paymentCredentialId = paymentCred.id;
        await model.PaymentHistory.create(data.paymentHistoryObj, { transaction });
    }


    data.accessLogObj.userId = user.id;
    await model.AccessLog.create(data.accessLogObj, { transaction });
    await model.IsvEnrollStatus.create(data.ISVEnrollObj, { transaction });
    await model.Preference.create(data.preferenceObj, { transaction });
    await model.SiteInspectionDetail.create(data.siteInspectionObj, { transaction });

    /**
     * Conditions For Same And Differnt Address
     */

    let userGrpAddress = await model.Address.create(data.userAddress, { transaction });

    data.userGroupAddressObj.addressId = userGrpAddress.id;
    data.userGroupAddressObj.userId = user.id;
    await model.GroupAddress.create(data.userGroupAddressObj, { transaction });

    if (data.userAddress.sameClientAddress) {

        data.clientGroupAddressObj.addressId = userGrpAddress.id;
        data.clientGroupAddressObj.clientId = clientData.id;
        await model.GroupAddress.create(data.clientGroupAddressObj, { transaction });

    }
    else {

        let clientGrpAddress = await model.Address.create(data.clientAddress, { transaction });
        data.clientGroupAddressObj.addressId = clientGrpAddress.id;
        data.clientGroupAddressObj.clientId = clientData.id;
        await model.GroupAddress.create(data.clientGroupAddressObj, { transaction });

    }
    if (data.clientObj.paidByClient) {

        if (data.userAddress.samePaymentAddressAsPersonal) {
            data.paymentGroupAddressObj.addressId = userGrpAddress.id;
            data.paymentGroupAddressObj.paymentCredentialId = paymentCred.id;
            await model.GroupAddress.create(data.paymentGroupAddressObj, { transaction });

        }
        else {
            let paymentGrpAddress = await model.Address.create(data.paymentAddress, { transaction });
            data.paymentGroupAddressObj.addressId = paymentGrpAddress.id
            data.paymentGroupAddressObj.paymentCredentialId = paymentCred.id;
            await model.GroupAddress.create(data.paymentGroupAddressObj, { transaction });

        }

        if (data.clientObj.mainPtContact) {
            if (data.userAddress.samePaymentAddressAsMainPt) {
                data.mainPtGroupAddressObj.addressId = userGrpAddress.id;
                data.mainPtGroupAddressObj.userId = mainPt.id;
                await model.GroupAddress.create(data.mainPtGroupAddressObj, { transaction });
            }
            else {
                let mainPtGrpAddress = await model.Address.create(data.mainPtAddress, { transaction });
                data.mainPtGroupAddressObj.addressId = mainPtGrpAddress.id
                data.mainPtGroupAddressObj.userId = mainPt.id;
                await model.GroupAddress.create(data.mainPtGroupAddressObj, { transaction });

            }
        }

    }

    // Subscription
    data.ficoSubscription.clientId = clientData.id;
    data.engageSubscription.clientId = clientData.id;
    await model.FeatureSubscription.create(data.engageSubscription, { transaction });
    await model.FeatureSubscription.create(data.ficoSubscription, { transaction });


    //If it is branch then destory temporary data.
    if (data.clientObj.isBranch) {
        await model.AdditionalSiteContactDetail.destroy({ where: { token: data.clientObj.parentToken }, transaction })
        await model.Client.update({ isParent: true }, { where: { id: data.clientObj.parentId }, transaction })
    }

    //If it is isv then destroy isv temp data
    if (data.clientObj.isISV) {
        await model.IsvTempRegistration.destroy({ where: { token: data.ISVEnrollObj.token }, transaction })
    }

    // Insert into alert distribution table
    await model.AlertDistribution.create({
        clientId: clientData.id,
        emailTo: JSON.stringify({ "others": [], "standard": ["loanOriginator"] }),
        emailCc: JSON.stringify({ "others": [], "standard": ["pointOfContact"] })
    }, { transaction });

    return clientData.id;

}

exports.addSameBillingEnrollment = async function (data, transaction) {

    let clientData = await model.Client.create(data.clientObj, { transaction });

    data.userPrimaryObj.clientId = clientData.id;
    data.userSecondaryObj.clientId = clientData.id;
    data.preferenceObj.clientId = clientData.id;
    data.engageSubscription.clientId = clientData.id;
    data.ficoSubscription.clientId = clientData.id;


    let user = await model.User.create(data.userPrimaryObj, { transaction });

    if (data.clientObj.mainPtContact) {
        var mainPt = await model.User.create(data.userSecondaryObj, { transaction });
    }

    data.accessLogObj.userId = user.dataValues.id;
    await model.AccessLog.create(data.accessLogObj, { transaction });
    await model.Preference.create(data.preferenceObj, { transaction });
    await model.FeatureSubscription.create(data.engageSubscription, { transaction });
    await model.FeatureSubscription.create(data.ficoSubscription, { transaction });

    /**
    * Conditions For Same And Differnt Address
    */
    let userGrpAddress = await model.Address.create(data.userAddress, { transaction });
    data.userGroupAddressObj.addressId = userGrpAddress.id;
    data.userGroupAddressObj.userId = user.dataValues.id;
    await model.GroupAddress.create(data.userGroupAddressObj, { transaction });

    if (data.userAddress.sameClientAddress) {
        data.clientGroupAddressObj.addressId = userGrpAddress.id;
        data.clientGroupAddressObj.clientId = clientData.id;
        await model.GroupAddress.create(data.clientGroupAddressObj, { transaction });
    }
    else {
        let clientGrpAddress = await model.Address.create(data.clientAddress, { transaction });
        data.clientGroupAddressObj.addressId = clientGrpAddress.id;
        data.clientGroupAddressObj.clientId = clientData.id;
        await model.GroupAddress.create(data.clientGroupAddressObj, { transaction });
    }


    if (data.clientObj.mainPtContact) {
        let mainPtGrpAddress = await model.Address.create(data.mainPtAddress, { transaction });
        data.mainPtGroupAddressObj.addressId = mainPtGrpAddress.id
        data.mainPtGroupAddressObj.userId = mainPt.id;
        await model.GroupAddress.create(data.mainPtGroupAddressObj, { transaction });
    }


    /**
     * If it is branch then destory temporary data.
     */
    if (data.clientObj.isBranch) {
        await model.AdditionalSiteContactDetail.destroy({ where: { token: data.clientObj.parentToken }, transaction })
        await model.Client.update({ isParent: true }, { where: { id: data.clientObj.parentId }, transaction })
    }

    /**
     *  fetch client pricing and pyament crediential info of parent
     */
    let clientPricing = await model.ClientPricing.findOne({
        attributes: ['pricingId'],
        where: { clientId: data.clientObj.parentId }
    })

    let paymentCredential = await model.PaymentCredential.findOne({
        attributes: ['credentialNumber', 'vaultId', 'credentialType', 'expiryDate', 'cardType', 'isPrimary', 'firstName', 'lastName', 'email', 'phoneNumber'],
        where: { clientId: data.clientObj.parentId }
    })

    clientPricing.dataValues.clientId = clientData.id
    paymentCredential.dataValues.clientId = clientData.id

    await model.ClientPricing.create(clientPricing.dataValues, { transaction });

    await model.PaymentCredential.create(paymentCredential.dataValues, { transaction });

    return clientData.id;

}

exports.addSiteInspection = function (data, clientId) {

    return model.SiteInspectionDetail.update(data, {
        where: { clientId: clientId }
    })
}
exports.getInfoForComplyTraq = function (clientId) {

    return model.Client.findOne({
        where: { id: clientId },
        include: [
            { model: model.User, where: { ownerLevel: constants.ownerLevel.PRIMARY } },
            { model: model.Address, include: [model.State, model.City] },
            { model: model.BusinessClassificationType, attributes: ['name'], },
        ]

    })

}

exports.getUserDetails = function (clientId) {
    let getUserDetails = model.User.findAll({
        where: { clientId: clientId, ownerLevel: { [Op.ne]: null } }
    })
    return getUserDetails
}

module.exports.saveComplyTraqDocumentInfo = async function (docObj) {
    await model.SiteInspectionDetail.update(docObj, {
        where: { clientId: docObj.clientId }
    })
}

exports.saveEnrollmentDocument = function (data) {
    return model.Document.bulkCreate(data)
}



exports.getPricing = function (data) {
    return model.Pricing.findOne({
        attributes: data.attr,
        where: {
            ...data.cond
        }
    });

}

exports.getDefaultPricing = function () {
    return model.Pricing.findOne({
        attributes: ['value1', 'value2', 'value3', 'value4'],
        where: {
            pricingHeadId: constants.pricingHead.STIKKUM,
            isCurrent: true
        }
    });

}

exports.getPartnerByLinkExtension = function (linkExtension) {
    let data = model.Partner.findOne({
        attributes: ['id', 'systemUserTypeId'],
        where: { landingPageLinkExt: linkExtension }
    });
    return data
}

exports.getSpecialLinkInfo = function (linkExtension) {
    return model.SpecialEnrollment.findOne({
        attributes: ['id', 'pricingId', 'partnerId'],
        where: { linkExtension: linkExtension }
    });
}

exports.getISVTempData = function (token) {
    return model.IsvTempRegistration.findOne({
        where: { token: token },
        include: [
            {
                model: model.Partner,
            }
        ]

    });
}

exports.getParentIdByToken = function (token) {
    return model.AdditionalSiteContactDetail.findOne({
        attributes: ['clientId'],
        where: { token: token },

    });
}

exports.getPricingByClientId = function (clientId) {
    return model.ClientPricing.findOne({
        attributes: ['clientId', 'pricingId'],
        where: { clientId: clientId },

    });
}



exports.getLandingPageInfo = function (linkExtension) {
    return model.Partner.findOne({
        attributes: ["id", "logoName", "description", "landingPageLinkExt"],
        where: { landingPageLinkExt: linkExtension },
        include: [
            { attributes: ["firstName", "lastName", "email", "mobileNumber", "profilePicName"], model: model.User },
            { attributes: ["value3", "value4"], model: model.Pricing, where: { isCurrent: true } }
        ]
    });

}

exports.saveContactUs = async function (contactUs) {
    return model.ContactUs.create(contactUs)
}

exports.getClientType = async function () {
    return model.ClientType.findAll({
        attributes: ['id', 'name']
    });
}
exports.getBusinessClassification = async function () {
    return model.BusinessClassificationType.findAll({
        attributes: ['id', 'name']
    });
}


































