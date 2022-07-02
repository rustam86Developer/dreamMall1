const model = require('../../models');
var sequelize = require('sequelize');
const Op = sequelize.Op;
const constants = require('../../helper/utilities/constants');


module.exports.getClientList = async function (condition, searchquery, options) {

    condition.statusId = {
        [Op.and]:
            [
                { [Op.ne]: constants.status.TO_DELETE },
                { [Op.ne]: constants.status.DELETED }
            ]
    }
    return await model.Client.findAll({

        order: [
            [model.Status, 'code', 'ASC'],
            ['createdAt', 'DESC'],
        ],
        where: condition,

        attributes: {
            exclude: ['PartnerId']
        },
        include: [
            {
                model: model.User,
                where: { ...searchquery }

            },
            {
                model: model.Partner,
                include: [{ model: model.SystemUserType },]

            },
            {
                model: model.Status,
            }
        ],

        //        limit: parseInt(options.limit),
        //        offset: parseInt(options.offset)
    },

    )

}

/**
 * get client listing count
 *  */

module.exports.getBrokerListCount = async function (condition, searchquery, options) {

    condition.statusId = {
        [Op.and]:
            [
                { [Op.ne]: constants.status.TO_DELETE },
                { [Op.ne]: constants.status.DELETED }
            ]
    }
    return await model.Client.count({
        where: condition,
        distinct: true,
        attributes: {
            exclude: ['PartnerId']
        },
        include: [
            {
                model: model.User,
                where: { ...searchquery }

            },
            {
                model: model.Partner,
                include: [{ model: model.SystemUserType },]

            },
        ],
    })

}

module.exports.addUser = async function (userObj, addressObj, transaction) {

    let userInfo = await model.User.create(userObj, { transaction });
    let addressInfo = await model.Address.create(addressObj, { transaction });

    var groupAddressObj = {
        addressId: addressInfo.id,
        userId: userInfo.id
    }
    await model.GroupAddress.create(groupAddressObj, { transaction });

}
module.exports.editUserById = function (data, userId) {

    return model.User.update(data, {
        where: { id: userId }
    })

}


module.exports.editAddressById = function (data, addressId) {

    return model.Address.update(data, {
        where: { id: addressId }
    })

}

module.exports.getNoteByClientId = async function (clientId) {

    return model.sequelize.query(
        `SELECT 
        date(createdAt) as date,
        group_concat(CONCAT('{"id":','"', id,'"', ', "description":','"',description,'"',',"createdAt":', '"',createdAt,'"', '}')) as descriptions
        FROM
        ClientNotes
        where clientId = ${clientId}
        group by date(updatedAt)
        ORDER BY date(updatedAt) DESC;`,
        { type: sequelize.QueryTypes.SELECT }
    )
}


module.exports.getCurrentPricing = async function (clientId) {

    return model.ClientPricing.findOne({

        where: { clientId: clientId },
        order: [['createdAt', 'DESC']],
        include: [{
            model: model.Pricing,
        }]

    })
}

module.exports.getPaymentCredByClientId = async function (clientId) {

    return model.PaymentCredential.findOne({
        attributes: ['id','firstName', 'lastName', 'email', 'phoneNumber', 'credentialType', 'credentialNumber', 'cardType'],
        where: {
            clientId: clientId, isPrimary: true
        },
        include: [

            {
                model: model.Address,
                include: [model.State, model.City]

            }
        ]

    })



}

module.exports.addNotes = function (data) {
    return model.ClientNote.create(data);

}

module.exports.updateNoteById = function (description, noteId) {

    return model.ClientNote.update({ description: description }, { where: { id: noteId } })

}


module.exports.deleteNoteById = function (noteId) {

    return model.ClientNote.destroy({ where: { id: noteId } });

}



module.exports.deleteDocumentById = function (deleteId) {

    return model.Document.destroy({ where: { id: deleteId } });

}






/**
 * Update client information
 */
module.exports.updateClientById = async function (data, transaction) {

    await model.Client.update(data.clientObj, { where: { id: data.clientId } }, transaction)
    await model.Address.update(data.addressObj, { where: { id: data.addressId } }, transaction)
    return true;

}
/**
 * Update client Partner information
 */
module.exports.updateClientPartnerById = async function (data,clientId,transaction) { 
   
    await model.Client.update(data, { where: { id:clientId } },transaction)
    await model.ClientPricing.update(data, { where: { clientId:clientId } },transaction)  
    return true;

}

module.exports.addBranchInfo = async function (data) {

    return model.AdditionalSiteContactDetail.create(data)
}


/**
 * Delete Site inpection Database
 */

module.exports.deleteBranchInfoById = function (branchId) {

    model.AdditionalSiteContactDetail.destroy({ where: { id: branchId } })

}



/**
 * Update Payment information
 */

module.exports.updatePaymentById = async function (data, transaction) {

    await model.PaymentCredential.update(data.paymentObj, { where: { id: data.paymentCredId }, transaction, })
    await model.Address.update(data.addressObj, { where: { id: data.addressId }, transaction })
    return true
}

/**
 * Update Pricing For Client.
 * pricingHeadId Null is used in where condition so that it will not update stikkum default pricing 
 */

module.exports.updateTransactionPrice = async function (data, transaction) {

    await model.Pricing.update({ isCurrent: false }, { where: { id: data.pricingId, pricingHeadId: null } }, { transaction })
    let pricing = await model.Pricing.create(data.pricingObj, { transaction });
    data.clientObj.pricingId = pricing.id;
    await model.ClientPricing.create(data.clientObj, { transaction });
    for (let i = 0; i < childClientIds.length; i++) {
        data.clientObj.clientId = childClientIds[i];
        await model.ClientPricing.create(data.clientObj, { transaction });
    }
    return;

}

module.exports.getPricingHistory = async function (clientId, transaction) {

    const getPricingId = await model.ClientPricing.findAll({ where: { clientId: clientId } }, transaction)
    var pricingIds = [];

    for (i = 0; i < getPricingId.length; i++) {
        pricingIds.push(getPricingId[i].pricingId);
    }
    const getPricingHistory = await model.Pricing.findAll({ where: { id: pricingIds }, order: [['createdAt', 'DESC']] }, transaction)
    return getPricingHistory;

}

module.exports.getPrimaryAndSecondaryUser = async function (clientId) {

    return model.User.findAll({
        where: {
            [Op.or]: [
                {
                    ownerLevel: constants.ownerLevel.PRIMARY
                },
                {
                    ownerLevel: constants.ownerLevel.SECONDARY
                }],
            [Op.and]: [
                {
                    clientId: clientId
                }],
        },
    })

}


module.exports.updateFeatureSubscription = async function (subscriptionObj, clientId, subscriptionTypeId) {

    model.FeatureSubscription.update(subscriptionObj,
        {
            where: { clientId: clientId, subscriptionTypeId: subscriptionTypeId }
        })

}

module.exports.updateComplyTraqDocDetails = async function (inspectionObj, clientId) {

    model.SiteInspectionDetail.update(inspectionObj,
        {
            where: { clientId: clientId }
        })

}

module.exports.updateEnrollmentStatus = async function (statusObj, clientId) {

    model.Client.update(statusObj,
        {
            where: { id: clientId }
        })

}

module.exports.updateBorrowerStatus = async function (statusObj, clientId) {

    model.BorrowerDatabase.update(statusObj,
        {
            where: { clientId: clientId }
        })

}


//************************************************************************************************************* */



/**
 *  Get users for login by client id
 */
module.exports.getUsersDataByClientId = async function (clientId) {
    return model.User.findAll({
        where: {
            clientId: clientId,
            statusId: constants.status.ACTIVE
        }
    })
}

/**
 * Get System User 
 *  */

module.exports.getPartnerIdsByType = function (systemUserTypeId) {
    return model.Partner.findAll({
        attributes: ['id'],
        where: { systemUserTypeId: systemUserTypeId }
    });

}
/**
* Count User 
*  */
async function countEndUsers(condition, searchquery) {

    return model.Client.count({
        where: condition,
    })
}


/**
 * Get client detail
 */

module.exports.viewClientById = async function (clientId) {
    return model.Client.findOne({
        where: { id: clientId },
        attributes: {
            exclude: ['PartnerId']
        },
        include: [
            {
                model: model.User,
                where: {
                    [Op.or]: [
                        {
                            ownerLevel: constants.ownerLevel.PRIMARY

                        },
                        {
                            ownerLevel: constants.ownerLevel.SECONDARY
                        }],
                },
                include: [{ model: model.Address, include: [model.State, model.City] }]
            },
            { model: model.SiteInspectionDetail },
            {
                model: model.AdditionalSiteContactDetail,
                include: [model.State, model.City]
            },
            { model: model.Document },

            // {
            //     model: model.PaymentCredential,
            //     where: {
            //         isPrimary: true
            //     },
            //     include: [{ model: model.Address, include: [model.State, model.City] }]
            // },
            { model: model.Preference },
            { model: model.FeatureSubscription },
            {
                model: model.Address,
                include: [model.State, model.City]
            },
            { model: model.ClientType, attributes: ['name'] },
            { model: model.BusinessClassificationType, attributes: ['name'], },
        ],
        order: [
            ['createdAt', 'DESC'],// Sorts by createdAt in descending order
            ['statusId', 'ASC'] // Sorts by statusId in ascending order
        ],

    })

}
/**
 * Get Branch client detail
 */

module.exports.clientBranchDetails = async function (clientId) {
    return clientBranchDetails = await model.Client.findAll({
        where: { parentId: clientId },
        attributes: {
            exclude: ['PartnerId']
        },
        include: [
            { model: model.User },

        ],
        order: [
            ['createdAt', 'DESC'], /* Sorts by createdAt in descending order*/
        ],

    })

    return clientBranchDetails;
}

/**
 * Delete Client 
 *  */


module.exports.deleteClient = async function (clientId, parentId, transaction) {
    let findClientId = clientId

    if (parentId != 'null') {
        findClientId = parentId
    }
    const getClientId = await model.Client.findAll({
        where: {
            parentId: findClientId,
            statusId: { [Op.ne]: constants.statusId.TO_DELETE }
        },
        attributes: ['id', 'parentId'],
    })
    let parnetId = getClientId.map(pp => pp.parentId);
    var totalBranch = parnetId.length;
    if (totalBranch <= 1) {
        await model.Client.update({
            isParent: constants.isParent.ISPARENT
        },
            {
                where: { id: findClientId }, transaction
            })

    }
    await model.User.update({
        statusId: constants.status.TO_DELETE
    }, {
        where: { clientId: clientId }, transaction
    })
    await model.Client.update({
        statusId: constants.status.TO_DELETE
    }, {
        where: { id: clientId }, transaction
    })
    return true
}

/**
 * Get client Details
 */
module.exports.getUserDetails = function (clientId) {
    let getUSerInfo = model.User.findAll(
        {
            where: {
                clientId: clientId, ownerLevel: { [Op.ne]: null }
            }
        })


    return getUSerInfo
}



/**
 * FOR ISV PUSH NOTFICATION
 *  */

module.exports.isIsvClient = async function (clientId) {

    let partnerClient = await model.Client.findOne({ where: { id: clientId, partnerId: { [model.sequelize.Op.ne]: null } }, attributes: ['partnerId'] })

    if (partnerClient) {
        let isIsv = await model.Partner.findOne({ where: { id: partnerClient.partnerId, systemUserTypeId: constants.systemUserType.ISV } });
        if (isIsv) return partnerClient.partnerId;
    }
    return null;
}

/**
 * Get ISV Status Url
  */

module.exports.getIsvEndpointUrls = function (partnerId) {
    return model.IsvCallback.findOne({
        where: { partnerId: partnerId }
    })
}

/**
 * Get Enroll Token 
  */

module.exports.getIsvClientEnrollStatus = async function (clientId) {
    return model.IsvEnrollStatus.findOne({ where: { clientId: clientId } })
}

module.exports.logStatusPushedResult = async function (logObj) {
    return model.IsvNotificationLog.create(logObj)
}

/**
 * Get Statu 
  */
module.exports.getSatus = async function (statusId) {
    const getStatuses = await model.Status.findOne({
        where: { id: statusId },
    })
    return getStatuses
}


/**
 * Upload Profile Picture
  */
module.exports.profilePicture = function (docInfo) {
    model.User.update({
        profilePicName: docInfo.profilePicName
    },
        {
            where: {
                id: docInfo.userId,
            }
        });
    return true
}



/**
 *  Get Additional Site Inspection By Id
 */

module.exports.getAdditionalSiteInspection = function (id) {
    let getAdditionalSiteInspection = model.AdditionalSiteContactDetail.findOne(
        {

            where: { id: id },
        })
    return getAdditionalSiteInspection
}
/**
 *  Update Additional SiteInspection By Id
 */

module.exports.updateAdditionalSiteInspection = function (id, editInfoObj) {
    model.AdditionalSiteContactDetail.update(editInfoObj, {
        where: { id: id },

    })
    return true
}



/**********Add Site Inspection database********************************** */
module.exports.additionalSiteInspection = function (addSiteInspectionData) {
    return model.AdditionalSiteContactDetail.create(addSiteInspectionData);
}

/**
 *  Get Acces Log Deatil
  */
module.exports.accessLog = function (accessLogsObj) {
    const accessLogObj = model.AccessLog.create(accessLogsObj);
    return accessLogObj;
}

exports.deleteProfilePictures = async function (userId) {
    const deletedProfilePicture = await model.User.update({ profilePicName: null },
        {
            where: {
                id: userId,
            }
        })

    return deletedProfilePicture
}


/****************check duplicate email********************* */

exports.checkDuplicateEmail = async function (checkDuplicateEmail) {


    return model.AdditionalSiteContactDetail.findOne({
        attributes: ['email'],
        where: {
            email: checkDuplicateEmail.checkEmail,
        }
    })

}


/******* partner details*********** */

exports.getPartnerListDetails = async function (id, companyName) {
    return await model.Partner.findAll(
        {
            where: {
                systemUserTypeId: id,
                // $and:{companyName:companyName},
            },

        });
}


/**
 * Get broker's information to fill in email template.
 */
module.exports.getClientInfoForTemplate = function (clientId) {
    return model.Client.findOne({
        where: { id: clientId },
        include: [
            {
                model: model.User,
                where: { ownerLevel: { [Op.ne]: null } },
                include: [{
                    model: model.Address,
                    include: [model.State, model.City]
                }]
            }
        ]
    })
}
