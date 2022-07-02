const dao = require('../../dao/common/miscellaneous');
const errorLog = require('../../helper/common/logger').errorLog;
const messages = require('../../helper/utilities/messages');
const httpStatus = require('../../helper/utilities/http-status');

//get all states autocomplete
exports.getState = async function (req, res) {
    try {
        let stateList = await dao.getState(req.query.keyword);
        res.status(httpStatus.OK).json(stateList);
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error Occur While Getting State Info: ${error}`);
    }
}

//get all cities autocomplete
exports.getCity = async function (req, res) {
    try {
        let cityList = await dao.getCity(req.query);
        res.status(httpStatus.OK).json(cityList);
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error Occur While Getting Getting City Info: ${error}`);
    }
}

/**
 *  GET STATE AND CITY ID
 */
module.exports.getStateCityId = async function (req, res) {
    try {
        let cityObj = { city: req.query.cityName }
        let stateId = await dao.getStateId(req.query.stateName);
        if (stateId != false) {
            cityObj.stateId = stateId;
            var cityId = await dao.getCityId(cityObj);
        }
        res.status(httpStatus.OK).json({ stateId: stateId, cityId: stateId != false ? cityId : '' });
    }
    catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error Occur While Fetching State and City : ${error}`);
    }
}
