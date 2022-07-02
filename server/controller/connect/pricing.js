const dao = require('../../dao/connect/pricing');
const messages = require('../../helper/utilities/messages');
const errorLog = require('../../helper/common/logger').errorLog;
const httpStatus = require('../../helper/utilities/http-status');
/**
 * get price all list 
 */
module.exports.getStikkumPricing = async function (req, res) {
    try {
        let priceList = await dao.getStikkumPricing();
        res.status(httpStatus.OK).json(priceList);
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({message: messages.toastr.SERVER_ERROR})
        errorLog.error(`Error occured while getting pricing list : ${error},`);
    }
}

/**
 * get price list by Id
 */
module.exports.pricingById = async function (req, res) {
    try {
        let priceData = await dao.getPricingById(req.params.id);
        res.status(httpStatus.OK).json(priceData);
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error occured while getting pricing list : ${error},`);
    }
}

/**
 * update price list
 */
module.exports.updatePricing = async function(req, res){
    
    try {
        await dao.updatePricing(req.params.id,req.body);
        res.status(httpStatus.OK).json({message: messages.toastr.PRICING_UPDATED})
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({message:messages.toastr.SERVER_ERROR})
        errorLog.error(`Error occured while updating preferences : ${error},`);
    }
    
}
