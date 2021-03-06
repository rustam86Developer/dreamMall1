const model = require('../../models');
const sequelize = require('sequelize');
const constant = require('../../helper/utilities/constants')
const Op = sequelize.Op;
const moment = require('moment');

module.exports.borrowerStatus = function () {
    return model.Status.findAll({
        attributes: ['id', 'name'],
        where: {
            code: {
                [Op.gte]: 100,
                [Op.lte]: 140
            }
        }
    })
}

exports.editBorrower = function (borrower, borrowerId, clientId) {
    return model.BorrowerDatabase.update(borrower, {
        where: {
            id: borrowerId,
            clientId: clientId
        }
    })
}

exports.getBorrowerById = function (borrowerId, clientId) {
    return model.BorrowerDatabase.findOne({
        where: { id: borrowerId, clientId: clientId }
    })
}

exports.insertBorrowers = function (borrowers, transaction) {
    return model.BorrowerDatabase.bulkCreate(borrowers, { transaction })
}

exports.getBorrowerList = function (searchObj) {
    return model.BorrowerDatabase.findAll({
        where: {
            clientId: searchObj.clientId,
            statusId: {
                [Op.and]:
                    [
                        { [Op.ne]: constant.status.TO_DELETE },
                        { [Op.ne]: constant.status.DELETED }
                    ]
            },
            [Op.and]: model.sequelize.literal(searchObj.key)
        },
        order: [
            ['totalAlert', 'DESC'],
            ['alertStatusId', 'ASC'],
            ['alertDate', 'DESC'],
        ],
        limit: parseInt(searchObj.pageSize),
        offset: parseInt(searchObj.pOffset)
    })
}

exports.getNumberOfBorrowers = function (searchObj) {
    return model.BorrowerDatabase.count({
        where: {
            clientId: searchObj.clientId,
            statusId: {
                [Op.and]:
                    [
                        { [Op.ne]: constant.status.TO_DELETE },
                        { [Op.ne]: constant.status.DELETED }
                    ]
            },
            [Op.and]: model.sequelize.literal(searchObj.key)
        }
    })
}

exports.deleteBorrowers = function (borrowerIds, transaction) {
    return model.BorrowerDatabase.update({ statusId: constant.status.TO_DELETE }, {
        where: {
            id: { [model.sequelize.Op.in]: borrowerIds }
        }
    }, transaction)
}

exports.getSelfPullData = function (borrowerDatabaseId, clientId) {
    return model.SelfPull.findAll({
        where: {
            borrowerDatabaseId: borrowerDatabaseId,
            clientId: clientId
        },
        order: [['id', 'DESC']]
    })
}

exports.createAlertLog = async function (alertObj) {
    await model.BorrowerDatabase.update({ alertStatusId: alertObj.statusId }, { where: { id: alertObj.borrowerDatabaseId } })
    return model.AlertHistory.create(alertObj)
}

exports.selfPullBorrower = function (selfPullObj) {
    return model.SelfPull.create(selfPullObj)
}

exports.deleteAlert = async function (options, transaction) {

    await model.AlertHistory.destroy({ where: { tuResponseId: options.tuResponseId } }, { transaction })
    await model.TuResponseReport.destroy({ where: { tuResponseId: options.tuResponseId } }, { transaction })
    await model.TuResponse.destroy({ where: { id: options.tuResponseId } }, { transaction })
    await model.BorrowerDatabase.update({
        totalAlert: sequelize.literal('totalAlert - 1'),
        ficoScore: null,
        alertStatusId: constant.status.STABLE,
        alertDate: null
    }, { where: { id: options.borrowerDatabaseId } }, { transaction });
    await model.SelfPull.create({ borrowerDatabaseId: options.borrowerDatabaseId, clientId: options.clientId, createdAt: moment(options.alertDate).add(-24, 'hours') })
}

exports.updateSAlertStatusRemark = function (alertHistoryId, remarks) {
    return model.AlertHistory.update({ remarks: remarks }, {
        where: { id: alertHistoryId }
    })
}

module.exports.getAlerts = async function (options) {
    return model.AlertHistory.findAll({
        where: { borrowerDatabaseId: options.borrowerId },
        include: ['Status'],
        order: [['id', 'DESC']]
    })
}

exports.clientEnrollmentStatus = function (clientId) {
    return model.Client.findOne({
        where: { id: clientId }
    })
}

exports.updateBorrowerCountLog = async function (options, transaction) {
    let lastLog = await model.BorrowerCountLog.findAll({
        where: {
            clientId: options.clientId
        },
        order: [['id', 'DESC']],
        limit: 1
    })
    lastLog = lastLog.length > 0 ? lastLog[0].borrowerCount : 0;
    return model.BorrowerCountLog.create({
        clientId: options.clientId,
        borrowerCount: lastLog + options.count
    }, { transaction })
}

module.exports.saveLoUsers = async function (los = {}, transaction) {
    for (const key in los) {
        const lo = los[key];
        let exists = await model.User.findOne({ where: { email: lo.email } });
        if (!exists) {
            await model.User.create(lo, { transaction })
        }
    }
}

module.exports.checkFicoSubscription = function (clientId) {
    return model.FeatureSubscription.findOne({
        where: {
            clientId: clientId,
            subscriptionTypeId: constant.subscriptionType.FICO,
            subscribed: true
        }
    })
}

module.exports.getFicoScores = function (date, tuResponseIds) {
    return model.TuResponse.findAll({
        attributes: ['createdAt', 'fico04Score'],
        where: {
            createdAt: { [Op.between]: [new Date(date), new Date()] },
            id: { [Op.in]: tuResponseIds }
        }
    })
}

exports.getAlertInfo = function (borrowerDatabaseId, clientId) {
    var currentDate = moment().format('YYYY-MM-DD');
    currentDate = "'" + currentDate + "'";
    return model.TuResponseReport.findOne({
        where: [
            sequelize.where(
                sequelize.fn('DATE', sequelize.col('TuResponseReport.createdAt')),
                sequelize.literal(currentDate)
            ),
            {
                borrowerDatabaseId: borrowerDatabaseId,
                clientId: clientId
            }
        ]
    })
}


exports.updateAlertStatus = async function (alertObj) {
    await model.BorrowerDatabase.update({ alertStatusId: constant.status.STABLE }, { where: { id: alertObj.borrowerDatabaseId } })
}

module.exports.getAlertDate = function (options, transaction) {
    return model.TuResponse.findOne(
        {
            attributes: ['createdAt'],
            where: { id: options.tuResponseId }
        }, { transaction }
    )
}

exports.snoozedBorrower = function (snoozedObj) {
    return model.SnoozedBorrower.create(snoozedObj);
}

exports.getSnoozedBorrower = function (borrowerId, clientId) {
    return model.SnoozedBorrower.findOne({
        where: { borrowerDatabaseId: borrowerId, clientId: clientId, isDelete: false }
    })
}

exports.editSnoozedBorrrower = function (snoozedObj, snoozedId) {
    return model.SnoozedBorrower.update(snoozedObj, {
        where: {
            id: snoozedId
        }
    })
}
