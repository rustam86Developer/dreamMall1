const model = require('../../models');
const sequelize = require('sequelize');
const constant = require('../../helper/utilities/constants')
const Op = sequelize.Op;


/**
 * Add templates
*/
exports.addTemplate = function (tempObj) {
    return model.Template.create(tempObj)
}

/**
 *  Update template name
 */
exports.updateTemplateName = function (editObj) {

    return model.Template.update({ name: editObj.name, fileName: editObj.fileName, subject: editObj.subject }, {
        where: {
            id: editObj.tempId
        }
    })
}

/**
 *  Delete Template
 */
exports.deleteTemplate = function (tempId) {
    return model.Template.update(
        { statusId: constant.status.DELETED },
        {
            where: {
                id: tempId
            }
        });
}

/**
 * Check if template name exists
 */
exports.checkIfTemplateNameExists = function (innerCondition) {
    if (!innerCondition.clientId) {
        innerCondition.clientId = null
    }
    return model.Template.findOne({
        where: innerCondition
    })
}

/**
 *  view templates
 */
exports.getTemplates = function (queryObj) {
    return model.Template.findAll({
        where: {
            [Op.or]: [{ ...queryObj }, { clientId: null, type: queryObj.type, statusId: constant.status.ACTIVE }],
            communicationType: 'email'
        },
        order: [
            ['createdAt', 'DESC'],
        ],
    })
}

/**
 *  get Default Templates
 */
module.exports.getDefaultTemplateByType = function (clientId, type, communicationType) {
    return model.DefaultTemplate.findOne({
        where: { clientId: clientId },
        include: [
            {
                model: model.Template,
                where: { statusId: constant.status.ACTIVE, type: type, communicationType: communicationType }
            },
        ], raw: true
    })
}

/**
 *  get default template template according to type
 */
// async function getDefaultTemplateByType(clientId, type) {
//     return model.DefaultTemplate.findOne({
//         where: { clientId: clientId },
//         include: [
//             {
//                 model: model.Template,
//                 where: { type: type }
//             },
//         ]
//     })
// }


/**
 *  set Default Templates
 */
//there is no include option for the update method.
exports.setDefaultTemplate = async function (clientId, type, tempId, communicationType) {
    let templatesData = await this.getDefaultTemplateByType(clientId, type, communicationType);
    if (!templatesData) {
        return model.DefaultTemplate.create({ clientId: clientId, templateId: tempId })
    } else {

        return model.DefaultTemplate.update({ templateId: tempId }, {
            where: { id: templatesData.id }
        })
    }
}

/**
 * get preferences data by client id
 */

exports.getPreferences = async function (clientId) {
    return await model.Preference.findOne({
        where: { clientId: clientId },
    })
}

exports.getFeatureSubscriptions = async function (clientId) {
    return await model.FeatureSubscription.findOne({
        where: {
            clientId: clientId,
            subscriptionTypeId: constant.subscriptionType.FICO
        },
    })
}

/**
 *  update preferences data
 */
exports.updatePreferences = function (preferencesObject) {
    return model.Preference.update(
        { ...preferencesObject },
        {
            where: { clientId: preferencesObject.clientId }
        })
}


/**
 *  update fico score
 */
exports.updateFico = async function (data, transaction) {

    await model.FeatureSubscription.update(
        { ...data.ficoScoreObj },
        {
            where: {
                clientId: data.ficoScoreObj.clientId,
                subscriptionTypeId: constant.subscriptionType.FICO
            }
        }, transaction)

    await model.AccessLog.create(data.accessLogObj, { transaction })

    return
}

/**
 * get smtp detail by client id
 */
exports.getSMTP = function (innerCondition) {
    return model.SmtpDetail.findOne({
        where: innerCondition,
    })
}

/**
 *  add smtp details by client id
 */
exports.addSMTP = function (smtpObject) {
    return model.SmtpDetail.upsert({ ...smtpObject })
}

/**
 *  Add or Update Alert distrbution data 
 */
exports.addAlertDistributionData = function (alertDistrbutionData) {
    return model.AlertDistribution.upsert({ ...alertDistrbutionData })
}

/**
 *  Get alert ditribution data
 */
exports.getAlertDistributionData = function (innerCondition) {
    return model.AlertDistribution.findOne({
        where: innerCondition
    })
}

exports.scheduleAutoAlertEmail = function (schduleObj) {
    return model.ScheduledProcess.upsert({ ...schduleObj })
}

// insert file name
exports.createEmailContentLog = function (fileName) {
    return model.CommunicationLogContent.create(fileName);
}

// insert createAutoAlertEmail details
exports.getScheduleInfo = async function (clientId) {
    let preferenceData = await model.Preference.findOne({ where: { clientId: clientId }, attributes: ['scheduledEmail'], raw: true });
    let scheduledInfo = null;
    if (preferenceData && preferenceData.scheduledEmail) {
        scheduledInfo = await model.ScheduledProcess.findOne({
            where: { clientId: clientId, recurrenceType: 'D', communicationType: 'email' }, raw: true
        })
    } else {
        scheduledInfo = await model.ScheduledProcess.findOne({
            where: { clientId: clientId, recurrenceType: 'D', communicationType: 'email' }, attributes: ['id'], raw: true
        })
    }
    return scheduledInfo;
}

exports.updateScheduledEmail = function (clientId, value) {
    return model.Preference.update(
        { scheduledEmail: value },
        {
            where: { clientId: clientId }
        })
}

exports.scheduleAutoSmsAlert = async function (data) {
    await model.Preference.update(
        { scheduledSms: true },
        {
            where: { clientId: data.clientId }
        });
    return model.ScheduledProcess.upsert({ ...data })
}

exports.getAutoSmsAlert = async function (clientId) {
    try {
        let autoAlertConfig = await model.Preference.findOne({
            where: { clientId: clientId },
            attributes: ['id', 'autoSms', 'scheduledSms']
        });
        let autoAlertData = {};
        let autoAlertSchedule = await model.ScheduledProcess.findOne({
            where: { clientId: clientId, recurrenceType: 'D', communicationType: 'sms' },
            raw: true,
        })
        if (autoAlertConfig.scheduledSms) {
            //If scheduled sms is active then we will pick all information of shceduled process.
            autoAlertData = autoAlertSchedule ? autoAlertSchedule : {};
        } else {
            //Otherwise we will only pick its id to use in upsert at the time of scheduling next job.
            autoAlertData['id'] = autoAlertSchedule ? autoAlertSchedule.id : null;
        }

        autoAlertData['preferenceTableId'] = autoAlertConfig.id;
        autoAlertData['isSubscribed'] = autoAlertConfig.autoSms;
        autoAlertData['scheduledSms'] = autoAlertConfig.scheduledSms ? autoAlertConfig.scheduledSms : false;
        return autoAlertData;
    } catch (error) {
        return error;
    }
}

exports.updateSmsAutoAlertSubscription = async function (clientId, isSubscribed) {
    await model.Preference.update(
        { autoSms: isSubscribed },
        {
            where: { clientId: clientId }
        });
    return;
}

exports.deavtivateScheduledAutoAlertSms = async function (clientId) {
    return model.Preference.update({
        scheduledSms: false
    }, {
        where: { clientId: clientId }
    })
}

exports.getEmailActiveAlertDetails = async function (clientId) {
    return model.ScheduledProcess.findOne(
        {
            where: { clientId: clientId, recurrenceType: 'D' }
        })
}