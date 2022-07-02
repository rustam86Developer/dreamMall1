const dao = require('../../dao/connect/promotion');
const errorLog = require('../../helper/common/logger').errorLog;
const messages = require('../../helper/utilities/messages');
const httpStatus = require('../../helper/utilities/http-status');

/**
 * @author Harinder Katiyar
 * @description  Check existing/duplicate promocode
 */

exports.checkExistingPromocode = async function (req, res) {
    try {
        let result = await dao.checkExistingPromocode(req.query.linkExtension)
        if(result != ''){
            res.status(httpStatus.OK).json({message: messages.toastr.PROMOCODE_ALREADY_EXISTS })
        }
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({message: messages.toastr.SERVER_ERROR})
        errorLog.error(`Error occured while checking duplicate promocode: ${error},`);
    }
}


/**
 * @author Harinder Katiyar
 * @description  Add promocode data
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.addPromocode = async function (req, res) {  
    try {
        let getPricingData = await dao.savePromocodePrice(req.body);   
        await dao.savePromocodeData(req.body, getPricingData.id);
        res.status(httpStatus.OK).json({message: messages.toastr.ADD_PROMOCODE})
    }
    catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({message: messages.toastr.SERVER_ERROR})
        errorLog.error(`Error occured while Adding Promocode: ${error} `);
    }
}
/**
 * @author Harinder katiyar
 * @description  Get all list of promocode
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.getAllPromocodeData = async function (req, res) {
    try {
       
        let promoCodeData = await dao.getAllPromocodeData();       
        res.status(httpStatus.OK).json(promoCodeData)
        
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({message: messages.toastr.SERVER_ERROR})
        errorLog.error(`Error occured while getting all data of promocode: ${error} `);
    }
}

/**
 * @author Harinder Katiyar
 * @description   Get promocode data by id
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.getPromocodeById = async function (req, res) {
  
    try {
        let promoCodeData = await dao.getPromocodeById(req.params.promocodeId);
        res.status(httpStatus.OK).json(promoCodeData);
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({message: messages.toastr.SERVER_ERROR})
        errorLog.error(`Error occured while getting promocode data by id: ${error}`);
    }
}

/**
 * @author Harinder Katiyar
 * @description  Delele promocode by id
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.deletePromocodeById = async function (req, res) {
    try {
        await dao.deletePromocodeById(req.params.promocodeId)

        res.status(httpStatus.OK).json({message: messages.toastr.PROMOCODE_DELETED })

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({message: messages.toastr.SERVER_ERROR})
        errorLog.error(`Error occured while deleting promocode data by id  : ${error}`);
    }
}
/**
 * @author Harinder Katiyar
 * @description  Send promocode email
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
/**************this is delted due to new requirement**************** */
/**
 * @author Harinder Katiyar
 * @description  Update promocode data
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.editPromocode = async function (req, res) {
    try {
       
        await dao.editPromocode(req.body);   
        res.status(httpStatus.OK).json({ message: messages.toastr.INFO_UPDATED});
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({message: messages.toastr.SERVER_ERROR})
        errorLog.error(`Error occured while updating promocode : ${error}`);
    }
}