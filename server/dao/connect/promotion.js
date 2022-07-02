const model = require('../../models');
var sequelize = require('sequelize');
const moment = require('moment');
const constants = require('../../helper/utilities/constants');

/**
 * @author Harinder Katiyar
 * @description  Check duplicate promocode name
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
exports.checkExistingPromocode = function (promocode) {
    return model.SpecialEnrollment.findAll({
        attributes: ['linkExtension'],
        where: {
            linkExtension: promocode
        }
    })
}

module.exports.savePromocodePrice = function (data) {
    let addPromocode = model.Pricing.create(data)
    return addPromocode
}

/**
 * @author Harinder Katiyar
 * @description  Insert promocode data in special enrollment tab
 */
module.exports.savePromocodeData = function (data, id) {
   
    return model.SpecialEnrollment.create({
        pricingId: id,
        linkExtension: data.linkExtension,
        startDate: data.startDate,
        endDate: data.endDate,
        statusId: constants.status.ACTIVE
    })
}
/**
 * @author Harinder Katiyar
 * @description  Get all promocode data
 */
module.exports.getAllPromocodeData = function () {
    return model.Pricing.findAll({
        where:{ isSpecial: 1},
        include: [
            {
                model: model.SpecialEnrollment,
                where: {
                    statusId: constants.status.ACTIVE,
                    partnerId:null,
                }
            }
        ],
        order: [
            ['createdAt', 'DESC'], // Sorts by createdAt in descending order
        ],
      
    })
}
/**
 * @author Harinder Katiyar
 * @description  Get promocode data by id
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.getPromocodeById = function (pricingId) {
    return model.SpecialEnrollment.findOne({
        where: { pricingId: pricingId },
    })
}
/**
 * @author Harinder Katiyar
 * @description  Delete promocode by id
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.deletePromocodeById = function (pricingId) {
    return model.SpecialEnrollment.update({ statusId: constants.status.DELETED }, {
        where: { pricingId: pricingId }
    });
}
/**
 * @author Harinder Katiyar
 * @description Save promocode emails in database
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.savePromocodeEmails = function (data) {
    return model.SpecialEnrollmentInvitation.bulkCreate(data);
}

/**
 * @author Harinder Katiyar
 * @description Update promocode data by id
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.editPromocode = function (data) {

    var startDate = new Date(data.startDate);
    var endDate = new Date(data.endDate);
    var formattedStartDate = moment(startDate).format();

    
    
    var formattedEndDate= moment(endDate).format();

    return model.SpecialEnrollment.update(
        {
            startDate: formattedStartDate,
            endDate: formattedEndDate
        },
        {
            where: { pricingId: data.id },
        })
}