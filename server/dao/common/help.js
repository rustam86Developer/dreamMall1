
const model = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const constants = require('../../helper/utilities/constants');
const messages = require('../../helper/utilities/messages');
/**
 * @author Harinder Katiyar
 * @description Save question insert into database
 */
exports.addFaq = function (addHelpFaq) {
    return model.Help.create(addHelpFaq);
}

/**
 * @author Harinder Katiyar
 * @description Save contactus data in database
 */

exports.addContactUs = function (contactData) {
    return model.ContactUs.create(contactData)
}

/**
 * @author Harinder Katiyar
 * @description Save document and video data in database
 */
exports.saveFileInformation = function (data) {
    return model.Help.create(data);

}


/**
 * @author Harinder Katiyar
 * @description Find all data by id in help module
 */
exports.getHelpDataById = function (id) {
    return model.Help.findOne(
        { where: { id: id } }
    );
}
/**
 * @author Harinder Katiyar
 * @description  Edit all data of help module
 */
exports.editHelpDataById = function (id, editHelpData) {
    return model.Help.update(editHelpData,
        { where: { id: id } });
}
/**
 * @author Harinder Katiyar
 * @description Delete data of help module By Id
 */
exports.deleteHelpDataById = function (id) {
    return model.Help.destroy(
        { where: { id: id } }
    );
}

/**
 * @author Aasif
 * @description Get All Data
 */

exports.viewAllData = async function (data) {
    let cond = data.systemUserTypeId != constants.systemUserType.ADMIN ? { addedFor: { [Op.regexp]: `[[:<:]](${data.systemUserTypeId}|5)[[:>:]]` } } : {};
    if (data.helpType == constants.helpType.FAQ) {

        let searchQ = data.keyword != constants.keyword.ALL ? { faqQuestion: { [Op.like]: '%' + data.keyword + '%' } } : {};
        viewAllData = await model.Help.findAll({
            attributes: ['id', 'faqQuestion', 'faqAnswer'],
            where:
            {
                helpType: data.helpType,
                ...searchQ,
                ...cond

            },
            order: [
                ['id', 'DESC'],
            ],
        });
    } else if (data.helpType == constants.helpType.VIDEO) {
        let searchQ = data.keyword != constants.keyword.ALL ? { videoTitle: { [Op.like]: '%' + data.keyword + '%' } } : {};
        viewAllData = await model.Help.findAll({
            attributes: ['id', 'videoOriginalName', 'videoModifiedName', 'videoTitle', 'videoDescription'],
            where:
            {
                helpType: data.helpType,
                ...searchQ,
                ...cond
            },
            order: [
                ['id', 'DESC'],
            ],
        });
    } else {
        let searchQ = data.keyword != constants.keyword.ALL ? { documentTitle: { [Op.like]: '%' + data.keyword + '%'  } } : {};
        viewAllData = await model.Help.findAll({
            attributes: ['id', 'documentOriginalName', 'documentModifiedName', 'documentTitle', 'documentDescription'],
            where:
            {
                helpType: data.helpType,
                ...searchQ,
                ...cond

            },
            order: [
                ['id', 'DESC'],
            ],
        });
    }
    return viewAllData;
}


