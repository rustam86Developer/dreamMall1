const model = require('../../models');
const moment = require('moment');
var sequelize = require('sequelize');
const Op = sequelize.Op;

/***************get billing details***************** */
module.exports.getbillingdetail = async function (clientId) {
    const billingdetail = await model.PaymentCredential.findOne({
        attributes: ['firstName', 'lastName', 'email', 'phoneNumber'],
        where: {
            clientId: clientId, isPrimary: true
        },
        include: [
            {
                model: model.Address,
                attributes: ['id', 'addressLine1', 'addressLine2', 'cityId', 'stateId', 'zipCode'],
                include: [model.State, model.City]

            }
        ]

    })
    return billingdetail;
}

/**
 * get client card details 
 */

module.exports.getCardDetails = async function (clientId) {
    const getCardDetails = await model.PaymentCredential.findAll({
        where: { clientId: clientId }
    })
    return getCardDetails;
}

/**
 * update primary card 
 */
module.exports.updatePrimaryCard = async function (paymentCredentialId, clientId) {
    try {
        transaction = await model.sequelize.transaction();
        const unsetPrimaryCard = await model.PaymentCredential.update({ isPrimary: 0 },
            { where: { clientId: clientId } }, { transaction })
        const setPrimaryCard = await model.PaymentCredential.update({ isPrimary: 1 },
            { where: { id: paymentCredentialId } }, { transaction })
        await transaction.commit();
        return { status: true }
    } catch (error) {
        return { status: false }
    }
}
/**
 * Add Card Details
 */
module.exports.addcardDetails = async function (data, cardDetailObj, addressId) {


    if (data.paymentObj.sameAsPrevious == false) {
        data.paymentCredObj.clientId = data.paymentObj.clientId;
        let cardDetail = await model.PaymentCredential.create(data.paymentCredObj);

        let paymentGrpAddress = await model.Address.create(data.paymentAddress);
        data.paymentGroupAddressObj.addressId = paymentGrpAddress.id
        data.paymentGroupAddressObj.paymentCredentialId = cardDetail.id;
        data.paymentGroupAddressObj.clientId = data.paymentObj.clientId;
        data.paymentGroupAddressObj.UserId = null;
        await model.GroupAddress.create(data.paymentGroupAddressObj);
        return true;
    }


    // /*****************when billing address same as previous**************************** */

    else {

        let cardDetail = await model.PaymentCredential.create(cardDetailObj);
        var groupAddressValue = {
            clientId: data.paymentObj.clientId,
            paymentCredentialId: cardDetail.id,
            addressId: addressId,
            userId: null,
        }
        await model.GroupAddress.create(groupAddressValue);
        return true;

    }

}

module.exports.addPartnerCard = function (details, transaction) {
    return model.PaymentCredential.create(details, { transaction });
}


module.exports.cardData = async function (paymentCredentialId) {
    const vaultId = await model.PaymentCredential.findOne({
        attributes: ['vaultId'],
        where: { id: paymentCredentialId },
    })
    return vaultId;
}
/**
 * Delete Card Details
 */
module.exports.deleteCardDetails = async function (deleteId) {

    deleteGroupAddress = await model.GroupAddress.destroy({
        where: {
            paymentCredentialId: deleteId
        }
    });
    const deleteCard = await model.PaymentCredential.destroy({
        where: {
            id: deleteId
        }

    });

    return deleteGroupAddress, deleteCard;
}


/**
 * Get partner_id
 *  */
exports.partnerDataByUserId = async function (userId) {
    const partnerData = await model.User.findOne({
        attributes: ['partnerId', 'firstName', 'lastName', 'email', 'phoneNumber'],
        where: { id: userId }
    })
    return partnerData;
}

//validate and check token expire time
exports.completeRegistration = async function (password, userId, transaction) {
    await model.User.update(
        { password: password },
        {
            where: {
                id: userId
            }, transaction
        }
    )
    return { message: "Password Updated", status: "true" }

}