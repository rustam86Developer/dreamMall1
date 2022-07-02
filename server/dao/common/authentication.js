const model = require('../../models');

/**
 * The function will fetch the email of user
 */
module.exports.getEmailByUserId = async function (userId) {

    return model.User.findOne({
        attributes: ['email','firstName','lastName','systemUserTypeId'],
        where: { id: userId }
    })

}

/**
 * update new password of user 
 */
module.exports.updatePassword = async function (email, newGeneratedPassword) {

    const updateResult = await model.User.update({ password: newGeneratedPassword },
        {
            where: {
                email: email,
            }
        })
    return updateResult
}

/**
 * Check Accounts against the email address
 */

module.exports.numberOfUsersByEmail = async function (email) {

    return model.User.findAll({ where: { email:email }})
     
    
}

/**
 * The function will fetch the password and other data against the email address
 */
module.exports.getAuthData = async function (email,systemUserType) {

    return model.User.findOne({
        attributes: ['id', 'password', 'statusId', 'clientId', 'partnerId', 'systemUserTypeId', 'roleId', 'addedBy'],
        where: { email: email,systemUserTypeId:systemUserType }
    })

}

/**
 *  Get fico information
 */
module.exports.getFicoData = async function (clientId) {
    return model.FeatureSubscription.findOne({
        attributes: ['id', 'subscribed'],
        where: { clientId: clientId,subscriptionTypeId:2 }
    })
}


/**
 * Check For Client Status `Approved/Pending/Rejected`
 */
module.exports.checkClientStatus = async function (clientId) {

    return model.Client.findOne({
        attributes: ['statusId'],
        where: { id: clientId }
    })

}

/**
 * Check For Partner Status `Active/InActive`
 */

module.exports.checkPartnerStatus = async function (partnerId) {

    return model.Partner.findOne({
        attributes: ['statusId'],
        where: { id: partnerId }
    })

}

/**
 * To Bind User Data In Local Storage
 */

module.exports.getUserInfo = function (email,systemUserType) {

    return model.User.findOne({
        where: { email: email,systemUserTypeId:systemUserType },
        include: [{ model: model.Role }]
    })
}

/**
 * After Sending Email For Password Token and UserId Is Saved
 */

module.exports.saveUserToken = function (userObj) {
    return model.UserToken.create(userObj);
}

/**
 * Check If Token Is Valid
 */

module.exports.checkIfValidToken = function (token) {

    return model.UserToken.findOne({
        attributes: ['userId'],
        where: [
            { token: token }
        ]
    });

}

module.exports.getClientByUserId = function (userId) {

    return model.User.findOne({
        attributes: ['clientId'],
        where: [
            { id: userId }
        ]
    });

}


/**
 * Update Password By UserId 
 */

module.exports.updatePasswordById = async function (userId, password) {

    return model.User.update({ password: password }, { where: { id: userId } })
}

/**
 * Destroy Token Once Used
 */

module.exports.destroyUserToken = async function (token) {
    model.UserToken.destroy({ where: { token: token } })
    return true
}

/**
 *  update user token
 */
module.exports.updateUserToken = function (data, userId) {
    model.User.update(data, { where: { id: userId } })

    return model.UserToken.update(data, { where: { userId: userId } })
}

/**
 * @author Anand Pratap Singh
 * @description This function is used to get the ISV token if exists
 */
module.exports.getIsvEnrollStatus = async function (token) {
    return model.IsvEnrollStatus.findOne({
        where: { token: token }
    })
}

/**
 * Checks whether the user exists with the provided match options.
 */
module.exports.isUserValid = function (options) {
    return model.User.findOne({ where:{options} , attributes: ['id'] })
}


/**
 * The function will fetch the email of user
 */
module.exports.branchClientById = async function (userId) {
    
    return model.Client.findOne({
        attributes: ['billingEntity'],
        where: { id: userId }
    })

}