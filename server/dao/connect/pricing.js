const model = require('../../models');
const constants = require('../../helper/utilities/constants');

/**
 * view all price detail for Stikkum pricingHead
 */

module.exports.getStikkumPricing = async function () {
    return await model.Pricing.findOne({
        where: { pricingHeadId: constants.pricingHead.STIKKUM, isCurrent: true }
    })
}

/**
 * get pricing by id
 */
module.exports.getPricingById = async function (pricingId) {
    let priceDetails = await model.Pricing.findOne({
        where: { id: pricingId }
    })
    return priceDetails
}

/**
 *  update pricing data
 */
exports.updatePricing = async function (pricingId,pricingObj) {
    
    checkExist = await model.Pricing.findOne({
        where: pricingObj
    });
    if (!checkExist) {
        await model.Pricing.update({ isCurrent: 0 }, {
            where: { id: pricingId }
        })
        pricingObj.isCurrent = true;
        await model.Pricing.create(pricingObj)
    }
    return true
}