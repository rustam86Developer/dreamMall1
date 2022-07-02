const model = require('../../models');
var sequelize = require('sequelize');
const constants = require('../../helper/utilities/constants');
const Op = sequelize.Op;

/**
 * Get SubModule Info
 */
module.exports.getSubmodules = function (systemUserType) {
    return model.sequelize.query(
        ` SELECT 
        *,
        (SELECT 
                GROUP_CONCAT(act.name)
            FROM
                Actions act
            WHERE
                FIND_IN_SET(act.id, sub.actionId)) AS act
         FROM
        Submodules sub
        where systemUserTypeId = ${systemUserType};
          `,
        { type: sequelize.QueryTypes.SELECT }
    )
}

/**
 * Get Module Info
 */
module.exports.getModules = function () {
    return model.Module.findAll();
}

/**
 *  Add User info in user, address and group address table
 */
module.exports.addUser = async function (mainObj, transaction) {

    if (mainObj.userObj && mainObj.addressObj) {

        let userInfo = await model.User.create(mainObj.userObj, { transaction });
        let addressInfo = await model.Address.create(mainObj.addressObj, { transaction });

        var groupAddressObj = {
            addressId: addressInfo.id,
            userId: userInfo.id
        }
        mainObj.userObj.userId = userInfo.id
        await model.GroupAddress.create(groupAddressObj, { transaction });
        await model.UserToken.create(mainObj.userObj, { transaction });

        return true
    }
    else {
        let userInfos = await model.User.create(mainObj, { transaction });
        mainObj.userId = userInfos.dataValues.id;
        return model.UserToken.create(mainObj, { transaction });
    }
}

/**
* update status id deleted when delete user
 */
module.exports.deleteUser = function (userId) {
    return model.User.update({ statusId: constants.status.DELETED, roleId: null }, {
        where: {
            id: userId
        }
    });
}

/**
 *  Get User Info
 */
module.exports.getUser = function (userInfo) {
    let innerCondition;
    if (userInfo.list == 'false' || userInfo.list == false) {
        innerCondition = { where: { id: userInfo.userId, statusId: { [Op.ne]: constants.status.DELETED } } }
    }
    else {
        if (userInfo.clientId == '') {
            innerCondition = { where: { clientId: null, ownerlevel: 'U', statusId: { [Op.ne]: constants.status.DELETED } } }
        } else if (userInfo.clientId) {
            innerCondition = { where: { clientId: userInfo.clientId, ownerlevel: 'U', statusId: { [Op.ne]: constants.status.DELETED } } }
        } else {
            innerCondition = { where: { partnerId: userInfo.partnerId, ownerlevel: 'U', statusId: { [Op.ne]: constants.status.DELETED } } }
        }

    }
    return model.User.findAll(
        {
            attributes: ['id', 'firstName', 'lastName', 'email', 'mobileNumber', 'phoneNumber', 'nmls'],
            ...innerCondition,

            include: [
                {
                    attributes: ['id', 'addressLine1', 'addressLine2', 'zipCode'],
                    model: model.Address,
                    include: [{
                        attributes: ['stateName'],
                        model: model.State,
                    },
                    {
                        attributes: ['city'],
                        model: model.City
                    }]
                },
                {
                    attributes: ['name'],
                    model: model.Role
                }
            ],
            order: [['id', 'DESC']]
        }
    )
}

/**
 *  Add Role Name and their Access Rights
 */
module.exports.addRolesAndAccess = function (roleObj) {
    model.Role.create(roleObj);
}

/**
 *  check Role is assigned to user 
 */
module.exports.checkIfRoleAssigned = function (roleId) {
    return model.User.findOne({
        where: { roleId: roleId, statusId: { [Op.ne]: constants.status.DELETED } }
    });
}

/**
 *  Delete Role Info
 */
module.exports.deleteRole = function (roleId) {
    model.Role.destroy({
        where: { id: roleId }
    });
}

/**
 * get GroupAddress table Info
 */

module.exports.getAddresssId = function (userId) {
    return model.GroupAddress.findOne({
        where: { userId: userId }
    });

}
/**
 * Get Client Details
 */

module.exports.getClientDetails = function (clientId) {
    let getUSerInfo = model.User.findAll(
        {
            where: {
                clientId: clientId, ownerLevel: { [Op.ne]: null }
            }
        })

    return getUSerInfo
}

/**
 *  Edit User Info
 */
module.exports.editUser = async function (editInfoObj, addressId, transaction) {
    await model.User.update(editInfoObj.userObj, {
        where: { id: editInfoObj.userObj.userId },
        transaction
    })
    await model.Address.update(editInfoObj.addressObj, {
        where: { id: addressId },
        transaction
    })

    return true

}

/**
 * Edit Roles and their Access
 */
module.exports.editAccessRight = function (roleInfo) {
    return model.Role.update(roleInfo, {
        where: {
            id: roleInfo.id
        }
    });
}

/**
 *  Get Role Info based on clientId , partnerId and roleId
 */
module.exports.getRole = function (innerCondition) {
    return model.Role.findAll(
        {
            ...innerCondition,
            order: [
                ['createdAt', 'DESC'], // Sorts by createdAt in descending order
            ],
        }
    );
}

/**
 *  check role is exist in role table
 */
module.exports.checkIfRoleExists = function (condition) {
    let query = {};
    if (condition.id) query['id'] = { [Op.ne]: condition.id };
    return model.Role.findOne({
        attributes: ['id'],
        where: {
            ...query,
            partnerId: condition.partnerId ? condition.partnerId : null,
            clientId: condition.clientId ? condition.clientId : null,
            name: condition.name.toUpperCase()
        }
    });
}
