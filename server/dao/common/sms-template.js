const model = require('../../models');
const constant = require('../../helper/utilities/constants')

module.exports.addSmsTemplate = function (data) {
    data.clientId = data.clientId && data.clientId != '' ? data.clientId : null;
    data.communicationType = 'sms'
    return model.Template.create(data);
}

module.exports.getAllSmsTemplates = async function (clientId) {
    clientId = clientId && clientId != '' ? clientId : null;
    let defaultTemplates = await model.DefaultTemplate.findAll({
        attributes: ['templateId'],
        where: { clientId: clientId },
        raw: true,
    });
    let defaultSmsTemplateIds = defaultTemplates.map(e => {
        return e.templateId;
    });

    let templates = await model.Template.findAll({ where: { clientId: { [Op.or]: [clientId, null] }, communicationType: 'sms', statusId: constant.status.ACTIVE }, raw: true });
    templates.forEach(e => {
        if (defaultSmsTemplateIds.includes(e.id))
            e['isDefaultTemplate'] = true
        else {
            e['isDefaultTemplate'] = false
        }
    })
    return templates
}

module.exports.deleteSmsTemplate = function (templateId) {
    return model.Template.destroy({ where: { id: templateId } });
}

module.exports.editSmsTemplate = function (data) {
    return model.Template.update({ name: data.name, body: data.body }, { where: { id: data.templateId } })
}

module.exports.getBrokerAndPrimaryContact = function (clientId) {
    return model.User.findAll({ where: { clientId: clientId } });
}