
const model = require('../../models');
const moment = require('moment');
var sequelize = require('sequelize');
var Op = sequelize.Op;


//only test purpose not use in apllicaion
module.exports.addData = async function (data, bulkDataObj) {
    if (bulkDataObj == true) {
      

        await model.TuResponseReport.bulkCreate(data)

    } else {
      
        let getData = await model.Client.create({
            legalName: 'TEST NAME'
        })
        await model.TuResponseReport.create({
            clientId: getData.id,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            email: data.email,
            phone: data.phone,
            brokerEmail: data.brokerEmail,
            brokerName: data.brokerName,
            value1: data.value1,
            value2: data.value2,

        });
    }
    return true

}
module.exports.getAllClientId = function () {
    let getData = model.Client.findAll()
    return getData
}


/**
 * @author Harinder Katiyar
 * @description Get bar chart data by week wise
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.getBarChartDataByWeek = function (clientId) {
    // var innerCondition = forReport ? clientObj : evaluateInnerCondition(clientObj);
    return model.TuResponseReport.findAll({
        logging: true,
        attributes: ['id', [sequelize.fn('count', sequelize.col('TuResponseReport.createdAt')), 'count'],
            [sequelize.fn('DAYNAME', sequelize.col('TuResponseReport.createdAt')), 'dayName']],
        where: [
            sequelize.where(
                sequelize.fn('WEEK', sequelize.col('TuResponseReport.createdAt')),
                sequelize.fn('WEEK', sequelize.fn('NOW'))
            ),
            { clientId: clientId },
        ],
        group: [sequelize.fn('WEEKDAY', sequelize.col('TuResponseReport.createdAt'))],
        order: [sequelize.fn('WEEKDAY', sequelize.col('TuResponseReport.createdAt'))],

    })

}
/**
 * @author Harinder Katiyar
 * @description Get bar chart data by monthly wise
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */

module.exports.getBarChartDataByMonth = function (clientId) {
    //    var innerCondition = forReport ? clientObj : evaluateInnerCondition(clientObj);
    return model.TuResponseReport.findAll({
        logging: true,
        attributes: ['id', [sequelize.fn('date', sequelize.col('TuResponseReport.createdAt')), 'date'],
            [sequelize.fn('count', sequelize.col('TuResponseReport.createdAt')), 'count']],
        where: [
            sequelize.where(
                sequelize.fn('MONTH', sequelize.col('TuResponseReport.createdAt')),
                sequelize.fn('MONTH', sequelize.fn('NOW'))
            ),
            { clientId: clientId },
        ],
        group: [sequelize.fn('DAY', sequelize.col('TuResponseReport.createdAt'))],
        order: [sequelize.fn('DAY', sequelize.col('TuResponseReport.createdAt'))],
    })
}
/**
 * @author Harinder Katiyar
 * @description Get bar chart data by quarter wise
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */

module.exports.getBarChartDataByQuarter = function (clientId) {

    return model.TuResponseReport.findAll({
        logging: true,
        attributes: ['id', [sequelize.fn('Quarter', sequelize.col('TuResponseReport.createdAt')), 'Quarter'],
            [sequelize.fn('count', sequelize.col('TuResponseReport.createdAt')), 'count']],
        where: [
            sequelize.where(
                sequelize.fn('YEAR', sequelize.col('TuResponseReport.createdAt')),
                sequelize.fn('YEAR', sequelize.fn('NOW'))
            ),
            { clientId: clientId },
        ],
        group: [sequelize.fn('Quarter', sequelize.col('TuResponseReport.createdAt'))],
    })
}
/**
 * @author Harinder Katiyar
 * @description Get bar chart data by year wise
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.getBarChartDataByYear = function (clientId) {


    return model.TuResponseReport.findAll({
        logging: true,
        attributes: ['id', [sequelize.fn('Month', sequelize.col('TuResponseReport.createdAt')), 'Month'],
            [sequelize.fn('count', sequelize.col('TuResponseReport.createdAt')), 'count'],
            [sequelize.fn('date_format', sequelize.col('TuResponseReport.createdAt'), '%M'), 'date_col_formatted']],
        where: [
            sequelize.where(
                sequelize.fn('YEAR', sequelize.col('TuResponseReport.createdAt')),
                sequelize.fn('YEAR', sequelize.fn('NOW'))
            ),
            { clientId: clientId },
        ],
        group: [sequelize.fn('Month', sequelize.col('TuResponseReport.createdAt'))],

    })
}
/**
 * @author Harinder Katiyar
 * @description Get tu data
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.getTUAlertData = function (clientId, param) {
    var currentDate = moment().utc().format('YYYY-MM-DD');
    currentDate = "'" + currentDate + "'";

    if (param == "date") {
        var typeOfData = sequelize.literal(currentDate)
    }
    else if (param == "yearweek") {
        var typeOfData = sequelize.fn('yearweek', sequelize.fn('NOW'))
    }
    else if (param == "month") {
        var typeOfData = sequelize.fn('month', sequelize.fn('NOW'))
    }
    else if (param == "quarter") {
        var typeOfData = sequelize.fn('quarter', sequelize.fn('NOW'))
    }
    else if (param == "year") {
        var typeOfData = sequelize.fn('year', sequelize.fn('NOW'))
    }
    return model.TuResponseReport.findAll({
        attributes: ['id', 'clientId', 'borrowerDatabaseId', 'firstName', 'lastName', 'address', 'email', 'phone', 'createdAt', 'clientExists'],
        where: [
            sequelize.where(
                sequelize.fn(param, sequelize.col('TuResponseReport.createdAt')),
                typeOfData,
            ),
            { clientId: clientId },
        ],
        order: [
            [sequelize.fn('DATE', sequelize.col('TuResponseReport.createdAt')), 'DESC']
        ]
    })
}

/**
 * @author Harinder Katiyar
 * @description Get ageing chart data current date
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.getAgeingChartTodayData = function (clientId) {
    var currentDate = moment().utc().format('YYYY-MM-DD');
    currentDate = "'" + currentDate + "'";
    return model.TuResponseReport.findAll({
        logging: true,
        where: [
            sequelize.where(
                sequelize.fn('DATE', sequelize.col('TuResponseReport.createdAt')),
                sequelize.literal(currentDate)
            ),
            { clientId: clientId },
        ],
    })
}
/**
 * @author Harinder Katiyar
 * @description Get ageing chart data last three days
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.getDataForLastThreeDays = function (clientId) {
    let fromDate = moment().utc().subtract(1, 'days').format('YYYY-MM-DD');
    let toDate = moment().utc().subtract(3, 'days').format('YYYY-MM-DD');

    return model.TuResponseReport.findAll({
        logging: true,
        where: [
            sequelize.where(
                sequelize.fn('DATE', sequelize.col('TuResponseReport.createdAt')), { [Op.between]: [toDate, fromDate] }),

            { clientId: clientId },
        ]
    })
}
/**
 * @author Harinder Katiyar
 * @description Get ageing chart All Days Data
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */
module.exports.getAllDaysData = function (clientId) {
    let threeDaysbeforeDate = moment().utc().subtract(3, 'days').format('YYYY-MM-DD')
    return model.TuResponseReport.findAll({
        logging: true,
        where: {
            createdAt: {
                [Op.lt]: threeDaysbeforeDate
            },
            clientId: clientId
        }
    })
}
