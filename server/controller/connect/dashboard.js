const dao = require('../../dao/connect/dashboard')
const messages = require('../../helper/utilities/messages');
const errorLog = require('../../helper/common/logger').errorLog;
const dashboardHelper = require('../../helper/connect/dashboard');
const httpStatus = require('../../helper/utilities/http-status');

//only test purpose no use in apllicaion
module.exports.addData = async function (req, res) {
    try {
        var getData;
        if (req.params.param == 'addone') {
            getData = await dao.addData(req.body)
        } else if (req.params.param == 'addmany') {
            getData = await dao.addData(req.body, req.body[0].bulkDataObj);
        }else {
            getData=  await dao.getAllClientId();
        }
        res.status(httpStatus.OK).json({ status: true, data: getData });
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ status: false, message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error Occur In Get Client Monthly Data On Dashboard : ${error}`);
    }
}
/**
 * @author Harinder Katiyar
 * @description Get bar chart data on dashboard
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.getBarChartData = async function (req, res) {
    try {
        if (req.params.params == 'week') {
            var getData = await dao.getBarChartDataByWeek(req.body.clientId);
        } else if (req.params.params == 'month') {
            var getData = await dao.getBarChartDataByMonth(req.body.clientId);
        } else if (req.params.params == 'quater') {
            var getData = await dao.getBarChartDataByQuarter(req.body.clientId);
        } else if (req.params.params == 'year') {
            var getData = await dao.getBarChartDataByYear(req.body.clientId);
        }
        res.status(httpStatus.OK).json({ data: getData, status: true });
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ status: false, message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error occured while getting bar chart data : ${error}`);
    }
}
/**
 * @author Harinder Katiyar
 * @description Get tu alerts data
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.getTUAlertData = async function (req, res) {
    try {
        let getData = await dao.getTUAlertData(req.body.clientId, req.params.params);
        res.status(httpStatus.OK).json({ data: getData, status: true });
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ status: false, message: messages.toastr.SERVER_ERROR})
        errorLog.error(`Error occured while getting tu alerts data : ${error}`);
    }
}
/**
 * @author Harinder Katiyar
 * @description Get all ageing chart data
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.getAgeingChartData = async function (req, res) {

    try {
        let getTodayData = await dao.getAgeingChartTodayData(req.query.clientId);
        let getLastThreeDaysData = await dao.getDataForLastThreeDays(req.query.clientId);
        let getAllDaysData = await dao.getAllDaysData(req.query.clientId);
        let getAlldata = await dashboardHelper.getAllChartData(getTodayData, getLastThreeDaysData, getAllDaysData);
        res.status(httpStatus.OK).json(getAlldata);
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error occured while getting ageing chart data: ${error}`);
    }
}