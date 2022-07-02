const model = require('../../models');
var sequelize = require('sequelize');
const Models = require('../../models');
const constants = require('../../helper/utilities/constants');
const Op = sequelize.Op;

/**
 * 
 * @author : pankaj
 * @date : 19-12-2019
 * @description : save report search criteria
 * 
 */

module.exports.searchCriteria = function (data) {

    return Models.SavedReport.create(data);
}

/**
 * 
 * @author : pankaj
 * @date : 19-12-2019
 * @description : Get saved report search criteria
 * 
 */

exports.searchCriteriasList = function (query) {
    // if clientId is not set i.e get admin snapshot
    if (!query.clientId) {
        query.clientId = null
    }
    return Models.SavedReport.findAll({
        where: query,
        order: [
            ['createdAt', 'DESC']
        ]
    })
}

/**
 * 
 * @author : pankaj
 * @date : 19-12-2019
 * @description : Delete search criteria
 * 
 */


exports.getLoName = async function (reportData) {

    let data = reportData[0].TuResponseReports;

    for (let i = 0; i < data.length; i++) {

        let borrwerInfo = await Models.BorrowerDatabase.findOne({
            attributes: ['brokerLoFirstName', 'brokerLoLastName'],
            where: { id: data[i].borrowerDatabaseId }

        })

        reportData[0].TuResponseReports[i].brokerLoFirstName = borrwerInfo.brokerLoFirstName;
        reportData[0].TuResponseReports[i].brokerLoLastName = borrwerInfo.brokerLoLastName;

    }
    //console.log(reportData)
    return reportData
}

exports.deleteSearchCriteria = function (id) {
    return Models.SavedReport.destroy({ where: { id: id } });
}

/**
 * 
 * @author : pankaj
 * @date : 20-12-2019
 * @description : Get loan originators list
 * 
 */

exports.loanOriginators = function (requestData) {
    let filterQuery = requestData.key != 'ALL' ? {
        brokerLoFirstName: {
            [Op.like]: requestData.key + "%"
        }
    } : {};

    return Models.BorrowerDatabase.findAll({
        attributes: ['id', 'brokerLoFirstName', 'brokerLoLastName', 'brokerLoEmail'],
        where: {
            clientId: requestData.clientId,
            ...filterQuery,
            brokerLoEmail: {
                [Op.ne]: null
            },
        },
        group: ['brokerLoFirstName']
    })
};

/**
 * 
 * @author : pankaj
 * @date : 20-12-2019
 * @description : Get end user list 
 * 
 */

exports.endUsersList = function (requestData) {
    let filterQuery = requestData.partnerId ? {
        partnerId: requestData.partnerId
    } : {}
    let secondFilterQuery = requestData.key != 'ALL' ? {

        legalName: {
            [Op.like]: requestData.key + "%"
        },

    } : {};
    return Models.Client.findAll({
        attributes: ['id', 'legalName', 'createdAt'],
        where: {
            ...secondFilterQuery,
            // statusId: 8
        },
        include: [{
            model: Models.User,
            attributes: [],
            where: { ownerLevel: "P" },
            include: [{
                model: Models.Status
            }]
        }]
    })
}

/**
 * 
 * @author : pankaj
 * @date : 20-12-2019
 * @description : Get partner list
 * 
 */

exports.partnersList = function (requestData) {

    let filterQuery = requestData.key != 'ALL' ? {
        companyName: {
            [Op.like]: requestData.key + "%"
        }
    } : {};
    return Models.Partner.findAll({
        attributes: ['id', 'companyName', 'systemUserTypeId', 'isvPaymentMode', 'createdAt'],
        where: {
            ...filterQuery,
            systemUserTypeId: requestData.partnerTypeId,
        },
        include: [{
            model: Models.Pricing,
            attributes: ['value1', 'value2']
        }]
    })
}

/**
 * 
 * @author : pankaj
 * @date : 20-12-2019
 * @description : Get branch list
 * 
 */

exports.branchList = function (requestData) {
    let filterQuery = requestData.key != 'ALL' ? {
        legalName: {
            [Op.like]: requestData.key + '%'
        }
    } : {};
    return Models.Client.findAll({
        attributes: ['id', 'legalName', 'createdAt'],
        where: {
            parentId: requestData.clientId,
            ...filterQuery
        }
    })
}


/**
 * 
 * @author : pankaj
 * @date : 19-12-2019
 * @description : Partner info
 * 
 */

exports.partnerInfo = function (id) {
    return Models.Partner.findOne({
        where: {
            id: id
        },
        attributes: ['id', 'companyName', 'isvPaymentMode', 'createdAt'],
        include: [{
            model: Models.Pricing,
            attributes: ['value1', 'value2'],
            where: {
                isCurrent: 1
            },
        },
        {
            model: Models.SystemUserType,
            attributes: ['name']
        }]
    })
}

/**
 * 
 * @author : pankaj
 * @date : 19-12-2019
 * @description : client info 
 * 
 */

exports.clientInfo = function (clientId) {
    return Models.Client.findOne({
        attributes: ['id', 'createdAt', 'billingEntity', 'parentId'],
        where: {
            id: clientId
        }
    })
}


/**
 * 
 * @author : Pankaj
 * @date : 
 * @description
 * 
 */

exports.overallSummaryCounts = function (filter) {
    return Models.AdminFlatData.findOne({
        where: filter
    });
}



/**
 * @author : pankaj
 * @date : 05-01-2020
 * @description : Get total and deleted monitored records
 */


exports.monitoredRecords = function (requestData, range, monitoredIdentifier) {
    let statusCode;

    let loanOriginatorsFilter = requestData.loanOriginator !== '' ? {
        brokerLoEmail: {
            [Op.like]: requestData.loanOriginatorEmail
        }
    } : {};

    let filterQuery = requestData.clientId != '' ? {
        id: requestData.clientId
    } : {};

    if (monitoredIdentifier == "Added") { statusCode = 300; } else { statusCode = 520; }

    return Models.Client.findAll({
        attributes: ['id', 'legalName', [sequelize.fn('COUNT', sequelize.col("BorrowerDatabases.id")), 'record' + monitoredIdentifier]],
        where: { ...filterQuery },
        include: [
            {
                model: Models.User,
                where: { ownerLevel: "P" },
                attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'email'],
                include: [{
                    model: Models.Status,
                }
                ]

            },
            {
                model: Models.BorrowerDatabase,
                attributes: [],
                where: {
                    ...[sequelize.literal(`date(${monitoredIdentifier == 'Deleted' ? 'BorrowerDatabases.deletedAt' : 'BorrowerDatabases.createdAt'}) between '${range.start}' and '${range.end}'`)],
                    ...loanOriginatorsFilter
                },
                include: [
                    {
                        model: Models.Status,
                        where: { code: statusCode },
                        attributes: [],
                    }
                ],
            }],
        group: ['id']
    });
}


/**
 * @author : pankaj
 * @date : 05-01-2020
 * @description : Get total and deleted monitored records graph
 */


exports.monitoredRecordGraph = function (requestData, range, monitoredIdentifier) {
    let statusCode;

    let loanOriginatorsFilter = requestData.loanOriginator !== '' ? {
        brokerLoEmail: {
            [Op.like]: requestData.loanOriginatorEmail
        }
    } : {};

    let filterQuery = requestData.clientId != '' ? {
        clientId: requestData.clientId
    } : {};

    if (monitoredIdentifier == "Added") { statusCode = 300; } else { statusCode = 520; }

    return Models.BorrowerDatabase.findAll({
        attributes: ['id', 'firstName', 'createdAt', 'deletedAt'],
        where: {
            ...[sequelize.literal(`date(${monitoredIdentifier == 'Deleted' ? 'BorrowerDatabase.deletedAt' : 'BorrowerDatabase.createdAt'}) between '${range.start}' and '${range.end}'`)],
            ...loanOriginatorsFilter,
            ...filterQuery
        },
        include: [
            {
                model: Models.Status,
                where: { code: statusCode },
                attributes: [],
            }
        ],
    });
}

/**
 * @author : pankaj
 * @date : 05-01-2020
 * @description : Get total and deleted monitored records
 */


exports.selfPullRecords = function (requestData, range) {

    let loanOriginatorsFilter = requestData.loanOriginator !== '' ? {
        brokerLoEmail: {
            [Op.like]: requestData.loanOriginatorEmail
        }
    } : {};

    let filterQuery = requestData.clientId != '' || requestData.reportFor == 'endUser' ? {
        clientId: requestData.clientId,
        ...loanOriginatorsFilter
    } : {};

    return Models.Client.findAll({
        attributes: ['id', 'legalName', [sequelize.fn('COUNT', sequelize.col("SelfPulls->BorrowerDatabase.id")), 'recordsSelfPulled']],
        include: [{
            model: Models.SelfPull,
            where: { ...[sequelize.literal(`date(SelfPulls.createdAt) between '${range.start}' and '${range.end}'`)] },
            attributes: [],
            include: [{
                model: Models.BorrowerDatabase,
                attributes: [],
                where: { ...filterQuery },
                include: [{
                    model: Models.Status
                }]
            }]
        },
        {
            model: Models.User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
            where: { ownerLevel: "P" },
            include: [
                {
                    model: Models.Status,
                    attributes: [],
                }
            ],

        }],
        group: ['id']
    });

}


/**
 * @author : pankaj
 * @date : 05-01-2020
 * @description : Self pull dates
 */

exports.selfPullsDate = function (requestData, range) {
    let loanOriginatorsFilter = requestData.loanOriginator !== '' ? {
        brokerLoEmail: {
            [Op.like]: requestData.loanOriginatorEmail
        }
    } : {};

    let filterQuery = requestData.clientId != '' || requestData.reportFor == 'endUser' ? {
        clientId: requestData.clientId
    } : {};

    return Models.SelfPull.findAll({
        where: {
            ...[sequelize.literal(`date(SelfPull.createdAt) between '${range.start}' and '${range.end}'`)],
            ...filterQuery
        },
        attributes: ['createdAt'],
        include: [{
            model: Models.BorrowerDatabase,
            where: {
                ...loanOriginatorsFilter
            },
            include: [{
                model: Models.Status
            }]
        }]
    })
}


/**
 * @author : Pankaj 
 * @date :
 * @description :
 * @tudo : 
 */

exports.alertTransaction = async function (requestData, range) {

    let loanOriginatorsFilter = requestData.loanOriginator ? {
        brokerEmail: {
            [Op.like]: requestData.loanOriginatorEmail
        }
    } : {};

    let filterQuery = requestData.clientId || requestData.reportFor == 'endUser' ? {
        clientId: requestData.clientId,
        ...loanOriginatorsFilter
    } : {};

    let ifPartner = requestData.reportFor == 'partner' || requestData.partnerId ? {
        partnerId: requestData.partnerId
    } : {};


    return Models.Client.findAll({
        attributes: ['id', 'legalName'],
        where: {
            ...ifPartner
        },
        include: [
            {
                model: Models.User,
                attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'email'],
                where: {
                    ownerLevel: "P"
                },
                include: [{
                    model: Models.Status,
                    attributes: []
                }]
            },
            {
                model: Models.Partner,
                attributes: ['companyName']
            },
            {
                model: Models.TuResponseReport,
                attributes: ['id', 'createdAt', 'firstName', 'lastName', 'email', 'phone'],
                where: {
                    ...[sequelize.literal(`date(TuResponseReports.createdAt) between '${range.start}' and '${range.end}'`)],
                    clientExists: 1,
                    ...filterQuery,

                },
            }]
    });

}


/**
 * @author : Pankaj 
 * @date :
 * @description : Billing report
 * @tudo : 
 */

exports.billingReports = async function (requestData, range) {

    let loanOriginatorsFilter = requestData.loanOriginator !== '' ? {
        brokerEmail: {
            [Op.like]: requestData.loanOriginatorEmail
        }
    } : {};

    let filterQuery = requestData.clientId != '' || requestData.reportFor == 'endUser' ? {
        clientId: requestData.clientId,
        ...loanOriginatorsFilter
    } : {};


    return Models.Client.findAll({
        attributes: ['id', 'legalName'],
        include: [
            {
                model: Models.ClientPricing,
                attributes: ['id'],
                include: [{
                    model: Models.Pricing,
                    where: { isCurrent: 1 },
                    attributes: ['value1', 'value2', 'value3', 'value4']
                }]
            },
            {
                model: Models.User,
                attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'email'],
                where: {
                    ownerLevel: "P"
                },
                include: [{
                    model: Models.Status,
                    attributes: []
                }]
            },
            {
                model: Models.TuResponseReport,
                attributes: ['id', 'borrowerDatabaseId', 'createdAt', 'firstName', 'lastName', 'email', 'phone', 'value1', 'value2', 'value3', 'value4'],
                where: {
                    ...[sequelize.literal(`date(TuResponseReports.createdAt) between '${range.start}' and '${range.end}'`)],
                    ...filterQuery,
                    clientExists: 1

                },
            }
        ]
    });

}


/**
 * @author : Pankaj 
 * @date :
 * @description : ISA/ISO alert commission
 * @tudo : 
 */

exports.alertCommission = async function (requestData, range) {

    let filter = requestData.timePeriod != 'All' ? {
        ...[sequelize.literal(`date(TuResponseReports.createdAt) between '${range.start}' and '${range.end}'`)]
    } : {};

    return Models.Client.findAll({
        attributes: ['id', 'legalName', 'createdAt'],
        where: {
            partnerId: requestData.partnerId
        },
        include: [{
            model: Models.User,
            required: false,
            attributes: ['firstName', 'lastName', 'email', 'phoneNumber'],
            where: { ownerLevel: "P" },
            include: [{
                model: Models.Status,
                attributes: []
            }]
        },
        {
            model: Models.ClientPricing,
            attributes: ['id'],
            include: [{
                model: Models.Pricing,
                attributes: ['value1', 'value2', 'value3', 'value4']
            }]
        },

        {
            model: Models.TuResponseReport,
            attributes: ['value2', 'value3'],
            where: {
                ...filter,
                clientExists: 1
            }

        }]

    });

}
// Function need to be fixed because of joins
exports.getCurrentPricing = async function (data) {

    for (let i = 0; i < data.length; i++) {

        let pricing = await Models.ClientPricing.findOne({
            where: { clientId: data[i].id },
            include: [
                { model: model.Pricing }
            ],
            order: [
                ['id', 'DESC'],
            ],
            limit: 1

        })

        data[i].currentPricing = pricing.Pricing.value2
        data[i].currentFico = pricing.Pricing.value3

    }
    return data
}


/**
* @author : Pankaj 
* @date :
* @description : ISA/ISO imp commission
* @tudo : 
*/

exports.impCommission = async function (requestData, range) {

    return Models.Client.findAll({
        attributes: ['id', 'legalName'],
        where: {
            partnerId: requestData.partnerId,
            ...[sequelize.literal(`date(Client.createdAt) between '${range.start}' and '${range.end}'`)],
        },
        include: [
            {
                model: Models.User,
                attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'email'],
                where: {
                    ownerLevel: "P"
                },
                include: [{
                    model: Models.Status
                }]
            },
            {
                model: Models.ClientPricing,
                attributes: ['id'],
                include: [{
                    model: Models.Pricing,
                    attributes: ['value1', 'value2', 'value3']
                }]
            }
        ]
    });
}




/**
 * @author : Pankaj 
 * @date :
 * @description : Admin alert summary
 * @tudo : 
 */


exports.adminAlertSummary = async function (requestData, range) {

    let filter = requestData.timePeriod != 'All' ? {
        ...[sequelize.literal(`date(TuResponseReports.createdAt) between '${range.start}' and '${range.end}'`)]
    } : {};

    return Models.Client.findAll({
        attributes: ['id', 'legalName', 'createdAt', [sequelize.fn('count', sequelize.col('TuResponseReports.id')), 'totalAlerts']],
        include: [
            {
                model: Models.User,
                required: false,
                attributes: ['firstName', 'lastName', 'email', 'phoneNumber'],
                where: { ownerLevel: "P" },
                include: [
                    {
                        model: Models.Status,
                        where: { code: 100 }
                    }
                ]
            },
            {
                attributes: ['id'],
                model: model.TuResponseReport,
                where: {
                    clientExists: 1,
                    ...filter
                }

            }
        ],
        group: ['id'],
        order: [
            ['createdAt', 'DESC'],
        ]
    });

}


/**
 * @author : Pankaj 
 * @date :
 * @description : Admin report summary || Billing
 * @tudo : 
 */

exports.adminBillingSummary = async function (requestData, range) {

    let filter = requestData.timePeriod != 'All' ? {
        ...[sequelize.literal(`date(TuResponseReports.createdAt) between '${range.start}' and '${range.end}'`)]
    } : {};

    return Models.Client.findAll({
        attributes: ['id', 'legalName', 'createdAt', [sequelize.fn("COUNT", sequelize.col("TuResponseReports.id")), "totalAlerts"], 'parentId', 'isParent'],

        include: [{
            model: Models.User,
            required: false,
            attributes: ['firstName', 'lastName', 'email', 'phoneNumber'],
            where: { ownerLevel: "P" },
            include: [{
                model: Models.Status,
                attributes: []
            }]
        },

        {
            model: Models.TuResponseReport,
            attributes: ['value3', 'value4', [sequelize.fn('SUM', sequelize.col("TuResponseReports.value3")), 'alertRate'], [sequelize.fn('SUM', sequelize.col("TuResponseReports.value4")), 'ficoRate']],
            where: {
                ...filter,
                clientExists: 1
            }

        },
        {
            model: Models.FeatureSubscription,
            attributes: ['subscribedDate'],
            where: { subscriptionTypeId: 2 }
        }],
        group: ['id'],

    });

}

/**
 * @author : Aasif 
 * @date :
 * @description : Engage Billing Summary
 * @tudo : 
 */
exports.engageBillingSummary = async function (filter, clientId) {
    var cond = clientId ? {
        clientId: clientId
    } : {};
    return Models.EngageFlatData.findAll({
        where: {
            ...filter,
            ...cond
        }
    });
}

/**
 * @author : Pankaj 
 * @date :
 * @description : Admin report summary || Monitored
 * @tudo : 
 */

exports.adminMoniteredSummary = async function (requestData, range) {

    let filter = requestData.timePeriod != 'All' ? {
        ...[sequelize.literal(`date(BorrowerDatabases.createdAt) between '${range.start}' and '${range.end}'`)]
    } : {};

    return Models.Client.findAll({
        attributes: [
            'id', 'legalName', 'createdAt',
            [sequelize.fn("COUNT", sequelize.col("BorrowerDatabases.id")), "totalMoniteredRecords"]
        ],
        where: {
            statusId: { [Op.notIn]: [constants.status.REJECTED, constants.status.PENDING, constants.status.DELETED] }
        },
        include: [{
            model: Models.User,
            required: false,
            attributes: ['firstName', 'lastName', 'email', 'phoneNumber'],
            where: { ownerLevel: "P" },
            include: [{
                model: Models.Status,
                attributes: []
            }]
        },
        {
            model: Models.BorrowerDatabase,
            attributes: [],
            where: {
                ...filter
            },
            include: [{
                model: Models.Status,
                attributes: [],
                where: {
                    code: 300
                }
            }]
        }],
        group: ['id']
    });

}

/**
 * @author : Pankaj 
 * @date :
 * @description : Admin report summary || By state
 * @tudo : 
 */

exports.endUserBystate = async function (requestData, range) {

    let filter = requestData.timePeriod != 'All' ? {
        ...[sequelize.literal(`date(Client.createdAt) between '${range.start}' and '${range.end}'`)]
    } : {};

    return Models.Client.findAll({
        attributes: ['id', 'legalName', 'createdAt', [sequelize.fn("COUNT", sequelize.col("TuResponseReports.id")), "totalAlerts"]],
        where: {
            ...filter
        },
        include: [{
            model: Models.User,
            required: false,
            attributes: ['firstName', 'lastName', 'email', 'phoneNumber'],
            where: { ownerLevel: "P" },
            include: [{
                model: Models.Status,
                attributes: []
            }]
        },
        {
            model: Models.Address,
            attributes: [],
            where: {
                stateId: requestData.stateId
            }
        },
        {
            model: Models.TuResponseReport,
            attributes: [],

        }],
        group: ['id']
    });

}


/**
 * @author : Pankaj 
 * @date :
 * @description : Admin report summary || end user by all state
 * @tudo : 
 */

exports.endUserByAllState = async function (requestData, range) {

    let filter = requestData.timePeriod != 'All' ? {
        ...[sequelize.literal(`date(Client.createdAt) between '${range.start}' and '${range.end}'`)]
    } : {};

    return Models.Client.findAll({
        attributes: [[sequelize.fn("COUNT", sequelize.col("Client.id")), "totalClient"]],
        where: {
            ...filter
        },
        include: [{
            model: Models.User,
            required: false,
            attributes: [],
            where: { ownerLevel: "P" },
            include: [{
                model: Models.Status,
                attributes: []
            }]
        },
        {
            model: Models.Address,
            attributes: ['id'],
            include: [{
                model: Models.State,
                attributes: ['stateName', 'id'],
            }]
        }],
        group: ['Addresses->State.id']
    });

}

/**
 * 
 * @author : Pankaj
 * @date : 17-01-2020
 * @description : alertSummary
 * 
 */

exports.alertSummary = async function (requestData, range) {

    let filter = requestData.timePeriod != 'All' ? {
        ...[sequelize.literal(`date(TuResponseReport.createdAt) between '${range.start}' and '${range.end}'`)]
    } : {};
    let loanOriginatorsFilter = requestData.loanOriginator ? {
        brokerEmail: {
            [Op.like]: requestData.loanOriginatorEmail
        }
    } : {};
    let cond = requestData.clientId || requestData.reportFor == 'endUser' ? {
        clientId: requestData.clientId,
        ...loanOriginatorsFilter
    } : {};
    let ifPartner = requestData.reportFor == 'partner' || requestData.partnerId ? {
        partnerId: requestData.partnerId
    } : {};

    return Models.TuResponseReport.findAll({
        attributes: ['id', 'borrowerDatabaseId', 'firstName', 'lastName', 'address', 'email', 'phone', 'value2', 'value3', 'createdAt', 'updatedAt'],
        where: {
            ...ifPartner
        },
        include: [{
            model: Models.TuResponse,
            attributes: ['fico04Score']
        }],
        where: {
            clientExists: 1,
            ...filter,
            ...cond,

        },
        order: [['updatedAt', 'DESC']]

    });

}




/**
 * 
 * @author : Pankaj
 * @date : 17-01-2020
 * @description : active alerts
 * 
 */

exports.activeAlerts = async function (requestData, range) {

    return Models.Client.findAll({
        attributes: ['id', 'legalName', [sequelize.fn('COUNT', sequelize.col("TuResponseReports.id")), 'totalAlerts']],
        include: [
            {
                model: Models.User,
                attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'email'],
                where: {
                    ownerLevel: "P"
                },
                include: [{
                    model: Models.Status,
                    attributes: []
                }]
            },
            {
                model: Models.TuResponseReport,
                attributes: [],
                where: {
                    ...[sequelize.literal(`date(TuResponseReports.createdAt) between '${range.start}' and '${range.end}'`)]

                },
            }
        ],
        group: ['id']
    });

}







/**
 * 
 * @author : Pankaj
 * @date : 17-01-2020
 * @description : Each month alert
 * 
 */

exports.monthAlertCount = async function (range) {

    let totalAlert = await Models.TuResponseReport.findAll({
        attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "totalAlerts"]],
        where: {
            clientExists: 1,
            ...[sequelize.literal(`date(createdAt) between '${range.start}' and '${range.end}'`)]
        }
    });

    let totalAlertAndFico = await Models.TuResponseReport.findAll({
        attributes: [[sequelize.fn('SUM', sequelize.col("value3")), 'totalAlertRate'], [sequelize.fn('SUM', sequelize.col("value4")), 'totalFicoRate']],
        where: {
            ...[sequelize.literal(`date(createdAt) between '${range.start}' and '${range.end}'`)]
        }
    });

    let totalMoniteredRecord = await Models.BorrowerDatabase.findAll({
        attributes: [[sequelize.fn("COUNT", sequelize.col("BorrowerDatabase.id")), "totalMoniteredRecord"]],
        where: {
            ...[sequelize.literal(`date(BorrowerDatabase.createdAt) between '${range.start}' and '${range.end}'`)]
        },
        include: [{
            model: Models.Status,
            attributes: [],
            where: {
                code: 300
            }
        }]
    });


    let totalClient = await Models.Client.findAll({
        attributes: [[sequelize.fn("COUNT", sequelize.col("Client.id")), "totalClient"]],
        where: {
            ...[sequelize.literal(`date(Client.createdAt) between '${range.start}' and '${range.end}'`)],
            parentId: null,
            statusId: { [Op.ne]: { [Op.or]: [constants.status.REJECTED, constants.status.PENDING, constants.status.DELETED] } }
        }
    });

    let totalBranch = await Models.Client.findAll({
        attributes: [[sequelize.fn("COUNT", sequelize.col("Client.id")), "totalBranch"]],
        where: {
            ...[sequelize.literal(`date(Client.createdAt) between '${range.start}' and '${range.end}'`)],
            isParent: 0,
            parentId: {
                [Op.ne]: null
            },
            statusId: { [Op.ne]: { [Op.or]: [constants.status.REJECTED, constants.status.PENDING, constants.status.DELETED] } }
        }
    });

    let implementaionAmount = await Models.Client.findAll({
        attributes: [[sequelize.fn('SUM', sequelize.col("value1")), 'implementaionAmount']],
        where: {
            ...[sequelize.literal(`date(Client.createdAt) between '${range.start}' and '${range.end}'`)]
        },
        include: [{
            model: Models.ClientPricing,
            attributes: [],
            include: [{
                model: Models.Pricing,
                where: { isCurrent: 1 },
                attributes: []
            }]

        }]
    });

    return {
        totalAlert: totalAlert,
        totalAlertAndFico: totalAlertAndFico,
        totalMoniteredRecord: totalMoniteredRecord,
        totalClient: totalClient,
        totalBranch: totalBranch,
        implementaionAmount: implementaionAmount
    }

}


/**
 * 
 * @author : Pankaj
 * @date : 17-01-2020
 * @description : active alerts
 * 
 */

exports.alertBillingHistory = async function (clientId) {

    // let filter = requestData.timePeriod != 'All' ? {
    //     ...[sequelize.literal(`date(Pricing.createdAt) between '${range.start}' and '${range.end}'`)]
    // } : {};
    return Models.ClientPricing.findAll({
        attributes: ['createdAt'],
        where: {
            clientId: clientId
        },
        include: [{
            model: Models.Pricing,
            attributes: ['value1', 'value2', 'value3', 'value4', 'createdAt'],
            where: {
                // ...filter
            }
        }],
        order: [
            ['createdAt', 'ASC'],
        ]
    });

}




exports.alertCountHistory = async function (clientId, start, end) {

    return Models.TuResponseReport.count({
        attributes: [],
        where: {
            clientId: clientId,
            ...[sequelize.literal(`date(createdAt) between '${start}' and '${end}'`)],
            clientExists: 1
        }, order: [
            ['createdAt', 'ASC'],
        ]
    });

}

exports.getEntityInfo = async function (options) {

    if (!options.partnerId) {
        /**
        * If the report is based on branch, update the companyId to branchId
        */

        return Models.Client.findOne({
            attributes: ['id', 'legalName'],
            where: {
                id: options.clientId
            },
            include: [
                {
                    model: Models.User,
                    attributes: ['firstName', 'lastName']

                },
                {
                    model: Models.ClientPricing,
                    where: {
                        id: {
                            [sequelize.Op.in]: [sequelize.literal('SELECT MAX(id) FROM ClientPricings GROUP BY clientId')]
                        }
                    },
                    include: [{
                        model: Models.Pricing,
                        attributes: ['value1', 'value2', 'value3']
                    }]
                },
                {
                    model: Models.FeatureSubscription,
                    attributes: ['subscribed'],
                    where: { subscriptionTypeId: 2 }
                }
            ]
        });
    } else {
        return Models.Partner.findOne({
            attributes: ['id', 'companyName', 'systemUserTypeId', 'isvPaymentMode'],
            where: {
                id: options.partnerId
            },
            include: [{
                model: Models.User,
                attributes: ['firstName', 'lastName']
            },
            {
                model: Models.Pricing,
                attributes: ['value1', 'value2', 'createdAt'],
                where: {
                    id: {
                        [sequelize.Op.in]: [sequelize.literal('SELECT MAX(id) FROM Pricings GROUP BY partnerId')]
                    }
                }
            }]
        })
    }

}

exports.getPartnerPricing = async function (partnerId, range) {
    return Models.Pricing.findAll({
        attributes: ['value1', 'value2', 'value3', 'value4', 'createdAt'],
        where: {
            partnerId: partnerId,
            ...[sequelize.literal(`date(createdAt) between '${range.start}' and '${range.end}'`)]
        }
    })
}

exports.getPartnerCurrentPricing = async function (partnerId) {
    return Models.Pricing.findOne({
        attributes: ['value1', 'value2', 'value3', 'value4', 'createdAt'],
        where: {
            partnerId: partnerId
        },
        limit: 1,
        order: [['createdAt', 'DESC']]
    })
}
exports.getTotalClient = async function (partnerId, range) {
    return Models.Client.findAll({
        attributes: ['legalName'],
        include: [
            {
                model: Models.User,
                attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'email'],
                where: {
                    ownerLevel: "P"
                },
                include: [{
                    model: Models.Status,
                    attributes: []
                }]
            }
        ],
        where: {
            partnerId: partnerId,
            ...[sequelize.literal(`date(Client.createdAt) between '${range.start}' and '${range.end}'`)]
        }
    });
}


