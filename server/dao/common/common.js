const model = require('../../models');
const moment = require('moment');
const constants = require('../../helper/utilities/constants')
var sequelize = require('sequelize');
const Op = sequelize.Op;
/**
 *  Add access log 
 */
exports.updateAccessLog = function (accessLogObject) {
    return model.AccessLog.create({ ...accessLogObject })
}

/**
 * get last entry
 */
exports.getLastEntry = function (type, clientId) {
    return model.LastEntry.findOne({
        where: {
            type: type,
            clientId: clientId
        }
    })
}

/**
 *  update last entry
 */
exports.updateLastEntry = function (options, transaction) {
    if (options.isNew) {
        delete options.isNew;
        return model.LastEntry.create({ ...options }, { transaction });
    }
    return model.LastEntry.update({ ...options }, { where: { clientId: options.clientId }, transaction })
}

/**
 * find duplicate email from login 
 */
exports.checkUserEmail = async function (data) {

    let filterQuery = data.userId ? {
        id: {
            [Op.ne]: data.userId
        }
    } : {};
    return model.User.findOne({
        where: {
            email: data.email, systemUserTypeId: data.systemUserType,
            ...filterQuery
        }
    })
}

exports.checkBranchEmail = async function (data) {

    let filterQuery = data.branchId ? {
        id: {
            [Op.ne]: data.branchId
        }
    } : {};
    return model.AdditionalSiteContactDetail.findOne({
        where: {
            email: data.email,
            ...filterQuery
        }
    })
}
/**
 * Get template file name
 */
exports.getTemplate = function (tempId) {
    return model.Template.findOne({
        attributes: ['id', 'clientId', 'name', 'fileName'],
        where: {
            id: tempId
        }
    })
}

/**
 *  @author ananda pratap singh
 *  @description Update client status
 */
exports.updateClientStatus = function (clientId, statusId, transaction) {
    return model.Client.update({ statusId: statusId }, {
        where: { id: clientId },
        transaction
    })
}
/**
 * Landing Page Engage Subscribe    
 */

exports.getClientIdByEmail = function (companyEmail) {

    return model.Client.findOne({
        where: {
            email: companyEmail
        }
    })

}
exports.getUserByEmail = function (email) {

    return model.User.findOne({
        where: {
            email: email
        }
    })

}

exports.getUserByClientId = function (clientId) {

    return model.User.findOne({
        where: {
            clientId: clientId, ownerLevel: constants.ownerLevel.PRIMARY
        }
    })

}


exports.checkIfAlreadySubscribed = function (clientId, subscriptionType) {

    return model.FeatureSubscription.findOne(
        {
            where: { clientId: clientId, subscriptionTypeId: subscriptionType }
        })

}


exports.updateFeatureSubscription = function (clientId, subscriptionType) {

    return model.FeatureSubscription.update(
        { subscribed: true, subscribedDate: moment().utc().format() },
        {
            where: { clientId: clientId, subscriptionTypeId: subscriptionType }
        })

}


/**
 * Returns a promise wrapped sequelize's Transaction instance
 */
exports.getSequelizeTransaction = function () {
    return model.sequelize.transaction();
}

