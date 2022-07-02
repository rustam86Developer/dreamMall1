const model = require('../../models');
var sequelize = require('sequelize');
const crypto = require('crypto');
const Op = sequelize.Op;
const constants = require('../../helper/utilities/constants');


/**
 * Add Partners
 *  */

module.exports.addPartner = async function (dataObj, transaction) {

    dataObj.userInfo.token = crypto.randomBytes(16).toString('hex');
    dataObj.partner.token = crypto.randomBytes(16).toString('hex');
    let partner = await model.Partner.create(dataObj.partner, { transaction });
    dataObj.userInfo.partnerId = partner.id;
    let user = await model.User.create(dataObj.userInfo, { transaction })
    let address = await model.Address.create(dataObj.address, { transaction })
    dataObj.groupAddress = {
        userId: user.id,
        addressId: address.id
    }
    //set userId for userToken table
    dataObj.userToken.userId= user.id,

    dataObj.pricing.partnerId = partner.id;
    await model.GroupAddress.create(dataObj.groupAddress, { transaction })
    await model.Pricing.create(dataObj.pricing, { transaction })
    // if partner type isv and payment mode self
    if (dataObj.partner.isvPaymentMode && dataObj.partner.isvPaymentMode == constants.isvPaymentMode.CLIENT) {
        dataObj.paymentInfo.partnerId = partner.id;
        await model.PaymentCredential.create(dataObj.paymentInfo, { transaction })
    }
    //only for referral and iso/isa partner
    if (dataObj.partner.systemUserTypeId != constants.systemUserType.ISV) {
        dataObj.partnerTemplateSelection.token = crypto.randomBytes(16).toString('hex');
        dataObj.partnerTemplateSelection.partnerId = partner.id;
        await model.PartnerTemplateSelection.create(dataObj.partnerTemplateSelection, { transaction })
    }
    let userToken = await model.UserToken.create(dataObj.userToken, { transaction })


    return { partnerData: partner, userData: user, userToken: userToken };
}

exports.checkLandingPageLinkExt = async function (linkExt) {
    const linkExtResult = await model.Partner.findOne({
        where: {
            landingPagelinkExt: linkExt,
        }
    })

    return linkExtResult;
}

exports.checkSpecialLinkExt = async function (linkExt) {
    const linkExtResult = await model.SpecialEnrollment.findOne({
        where: {
            linkExtension: linkExt,
        }
    })

    return linkExtResult;
}

exports.getAllTemplate = async function () {
    const getTemplateName = await model.PartnerTemplate.findAll({
        attributes: ['id', 'name']
    })
    return getTemplateName
}

//view stikkum partner by Id
module.exports.getPartnerById = async function (id) {

    const partnerDetails = await model.Partner.findOne({
        where: { id: id },
        include: [
            {
                model: model.User,
                include: [{
                    model: model.Address,
                    include: [{
                        attributes: ['stateName'],
                        model: model.State,
                    },
                    {
                        attributes: ['city'],
                        model: model.City
                    }]
                }]
            },
            { model: model.PartnerTemplateSelection },
            {
                model: model.Pricing,
                where: {
                    isCurrent: 1
                }
            },
            { model: model.Document }
        ]
    })
    return partnerDetails
}
/**
 * Edit Partner
 */
exports.editPartner = async function (partnerId, partnerInfoObj, transaction) {
    // update partner info
    await model.Partner.update(partnerInfoObj.partner, {
        where: {
            id: partnerId
        },
        transaction
    })

    // update user info
    await model.User.update(partnerInfoObj.userInfo, {
        where: { partnerId: partnerId },
        transaction
    })

    // update address
    await model.Address.update(partnerInfoObj.address, {
        where: { id: partnerInfoObj.address.id },
        transaction
    })

    //update pricing if no change in price else insert new price and update old price
    await createPricingHistory(partnerId, partnerInfoObj.pricing, transaction)
    return true
}

/**
 * create pricing history is we change price at the time edit partner
 */
async function createPricingHistory(partnerId, pricingObj, transaction) {
    pricingObj.partnerId = partnerId
    let pricingExist = await checkIsCurrent(pricingObj)
    if (pricingExist) {
        await model.Pricing.update({ isCurrent: 0 }, {
            where: { partnerId: partnerId },
            transaction
        })
        pricingObj.isCurrent = 1;
        await addPricing(pricingObj, transaction)

    } //else {

    //     model.Pricing.update(pricingObj, {
    //         where: { partnerId: partnerId },
    //         transaction
    //     })
    // }
    return true
}

/**
 * Get All Partner Details
 */
exports.getAllPartners = async function () {
    const partnerDetails = await model.Partner.findAll({
        attributes: ['id', 'companyName', 'systemUserTypeId', [sequelize.fn('count', sequelize.col('TuResponseReports.id')), 'totalAlerts']],
        include: [
            {
                model: model.User,
                attributes: ['id', 'email', 'systemUserTypeId']

            },
            {
                model: model.Pricing,
                where: {
                    isCurrent: 1
                }

            },
            {
                attributes: ['id'],
                model: model.TuResponseReport,
                required: false,
                where: {
                    clientExists: 0
                }
            }
        ],
        group: ['id'],
        order: [
            ['createdAt', 'DESC'],
        ],

    })
    return partnerDetails
}
/**
 * Generate Link
 */
exports.generateLink = async function (dataObj) {

    checkPrice = await checkDuplicatePrice(dataObj.pricing)

    // added pricing
    if (!checkPrice) {
        let addedPrice = await addPricing(dataObj.pricing)
        dataObj.linkExt.pricingId = addedPrice.id
        //add link extension
        model.SpecialEnrollment.create(dataObj.linkExt, {
        })
        return true;

    } else {
        return false;
    }

}
/**
 * check duplicate Price
 */
async function checkDuplicatePrice(pricingObj) {
    return model.Pricing.findOne({
        where: pricingObj
    });

}

async function checkIsCurrent(pricingObj) {
    return model.Pricing.findOne({
        where: {partnerId:pricingObj.partnerId,isCurrent: true }
    });

}





/**
 * Add Pricing 
 */
async function addPricing(pricingObj, transaction) {
    return model.Pricing.create(pricingObj, {
        transaction
    })

}

exports.getGeneratedLink = async function (partnerId, statusId) {
    const generatedLinksData = await model.SpecialEnrollment.findAll({
        attributes: ['id', 'linkExtension'],
        include: [
            {
                attributes: ['value1', 'value2', 'value3', 'value4'],
                model: model.Pricing
            }
        ],
        where: {
            partnerId: partnerId,
            statusId: statusId
        },
        order: [
            ['createdAt', 'DESC'], // Sorts by createdAt in descending order
        ],
    })
    return generatedLinksData;
}

/**
 * get generated Link Details By Id
 */
exports.getGeneratedLinkById = async function (id, statusId) {
    const generatedLinksData = await model.SpecialEnrollment.findOne({
        attributes: ['id', 'linkExtension'],
        include: [
            {
                attributes: ['value1', 'value2', 'value3', 'value4'],
                model: model.Pricing
            }
        ],
        where: {
            id: id,
            statusId: statusId
        }
    })
    return generatedLinksData;
}

/**
 * Get Generated Link Price
 *  */
module.exports.getLinkPrice = async function (partnerId) {
    const linkPrice = await model.Pricing.findOne({
        attributes: ['value1', 'value2', 'value3', 'value4'],
        where: {
            partnerId: partnerId,
            isCurrent: 1
        }
    })
    return linkPrice;
}

/**
 * Get Client List Of Partner
 */
module.exports.getClientListOfPartner = async function (partnerId, statusId) {
    const stikkumClientList = await model.Client.findAll({
        attributes: ['id', [sequelize.fn('count', sequelize.col('TuResponseReports.id')), 'totalAlerts']],
        where: {
            partnerId: partnerId,
        },
        include: [
            {
                attributes: ['systemUserTypeId', 'isvPaymentMode'],
                model: model.Partner
            },
            {
                attributes: ['firstName', 'lastName', 'email'],
                model: model.User
            },
            {
                attributes: ['id'],
                model: model.ClientPricing,
                include: [
                    {
                        attributes: ['value3', 'value4'],
                        model: model.Pricing
                    }
                ]
            },
            {
                attributes: ['id'],
                model: model.TuResponseReport,
                required: false,
                where: {
                    clientExists: 0
                }
            }
        ],
        group: ['id']
    })
    return stikkumClientList;
}

/**
 * Get Invited Client Data
 */
module.exports.getInvitedClientData = async function (partnerId) {

    const isaInvitedClientData = await model.SpecialEnrollmentInvitation.findAll({
        include: [
            {
                attributes: ['linkExtension'],
                model: model.SpecialEnrollment,
                include: [
                    { model: model.Pricing }
                ],
                where: { partnerId: partnerId }
            }
        ]
    });
    return isaInvitedClientData;
}
/**
 * add or update Logo and profileImage
 */
exports.addImage = async function (docInfo) {
    if (docInfo.logoName) {
        await model.Partner.update({ logoName: docInfo.logoName }, {
            where: {
                id: docInfo.partnerId
            }
        })

    }
    if (docInfo.profilePicName) {
        await model.User.update({ profilePicName: docInfo.profilePicName }, {
            where: {
                partnerId: docInfo.partnerId
            }
        })
    }
    return true
}

//save partner document
exports.saveDocument = async function (docInfo) {
    await model.Document.create(docInfo, {

    });
    return true
}

exports.shareGeneratedLink = async function (shareLinkData) {
    const response = await model.SpecialEnrollmentInvitation.bulkCreate(shareLinkData);
    return response;
}