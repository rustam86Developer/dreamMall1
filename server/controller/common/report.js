const reportDAO = require('../../dao/common/report');
const brokerDao = require('../../dao/connect/broker')
const reporthelper = require('../../helper/common/report');
const errorlog = require('../../helper/common/logger').errorlog;
const pdfUtils = require('../../utils/pdf');
const moment = require('moment');
const fs = require('fs');
const excelUtils = require('../../utils/xls');
const messages = require('../../helper/utilities/messages');
const httpStatus = require('../../helper/utilities/http-status');

/**
 * 
 * @author : pankaj
 * @date : 19-12-2019
 * @description : Save search criteria
 * 
 */

exports.searchCriteria = async function (req, res) {
    try {
        await reportDAO.searchCriteria(req.body)
        res.status(httpStatus.OK).json({ message: messages.toastr.SAVE_SEARCH_CRITERIA })
    }
    catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error occured while adding snapshot: ${error}`);
    }
}

/**
 * 
 * @author : Pankaj
 * @date : 20-12-2019
 * @description : Search criteria list
 * 
 */

exports.searchCriterias = async function (req, res) {
    try {

        let clientId = req.query.clientId;
        let partnerId = req.query.partnerId
        let query = {};
        if (clientId) query.clientId = clientId;
        if (partnerId) query.partnerId = partnerId;

        let snapshotDetails = await reportDAO.searchCriteriasList(query);

        res.status(httpStatus.OK).json(snapshotDetails)


    } catch (error) {
        res.status(500).json({ message: messages.toastr.SERVER_ERROR });
        errorlog.error(httpStatus.SERVER_ERROR + " : " + error);

    }
}

/**
 * 
 * @author : Pankaj
 * @date : 20-12-2019
 * @description : Delete search criteria
 * 
 */

exports.deleteSearchCriteria = async function (req, res) {
    try {

        let criteriaId = req.params.id;

        await reportDAO.deleteSearchCriteria(criteriaId);

        res.status(httpStatus.OK).json({ message: messages.toastr.DELETE_SEARCH_CRITERIA });


    } catch (error) {
        res.status(500).json({ message: messages.toastr.SERVER_ERROR });
        errorlog.error(httpStatus.SERVER_ERROR + " : " + error);

    }
}


/**
 * 
 * @author : Pankaj
 * @date : 20-12-2019
 * @description : Auto complete data || get loan originators, end users, partners and branch list
 * 
 */

exports.autocompleteData = async function (req, res) {
    try {

        let requestData = req.query;
        let responseData = [];

        switch (requestData.type) {
            case "lo":

                responseData = await reportDAO.loanOriginators(requestData);
                responseData = await reporthelper.autoCompleteObject(responseData, "lo");

                break;

            case "endUser":

                responseData = await reportDAO.endUsersList(requestData);
                responseData = await reporthelper.autoCompleteObject(responseData, "endUser");

                break;

            case "partner":

                responseData = await reportDAO.partnersList(requestData);
                responseData = await reporthelper.autoCompleteObject(responseData, "partner");

                break;

            case "branch":

                responseData = await reportDAO.branchList(requestData);
                responseData = await reporthelper.autoCompleteObject(responseData, "branch");

                break;

        }

        res.status(httpStatus.OK).json(responseData);

    } catch (error) {
        res.status(500).json({ message: messages.toastr.SERVER_ERROR });
        errorlog.error(httpStatus.SERVER_ERROR + " : " + error);

    }
}


/**
 * 
 * @author : Pankaj
 * @date : 20-12-2019
 * @description : get partner details
 * 
 */

exports.partnerInfo = async function (req, res) {
    try {

        let partnerId = req.params.id;

        let partnerDetails = await reportDAO.partnerInfo(partnerId);

        res.status(httpStatus.OK).json(partnerDetails);


    } catch (error) {
        res.status(500).json({ message: messages.toastr.SERVER_ERROR });
        errorlog.error(httpStatus.SERVER_ERROR + " : " + error);

    }
}


/**
 * 
 * @author : Pankaj
 * @date : 20-12-2019
 * @description : get client info
 * 
 */

exports.clientInfo = async function (req, res) {
    try {

        let clientId = req.params.id;

        let clientDetails = await reportDAO.clientInfo(clientId);

        res.status(httpStatus.OK).json(clientDetails);


    } catch (error) {
        res.status(500).json({ message: messages.toastr.SERVER_ERROR });
        errorlog.error(httpStatus.SERVER_ERROR + " : " + error);

    }
}

/**
 * 
 * Author : Pankaj
 * Date : 20-12-2019
 * For : Get overall Summary Counts for admin dashboard
 * 
 */

exports.overallSummaryCounts = async function (req, res) {

    try {
        //Get paramerters and store in requestData variable
        let requestData = req.query;

        //Calculation of date
        let filter = await reporthelper.overallSummaryFilter(requestData);


        // Get Total alert from DAO
        var responseData = await reportDAO.overallSummaryCounts(filter);

        res.status(httpStatus.OK).json(responseData);

    } catch (error) {
        res.status(500).json({ message: messages.toastr.SERVER_ERROR });
        errorlog.error(httpStatus.SERVER_ERROR + " : " + error);

    }

}


/**
* 
* @author : Pankaj jha
* @date :  01-01-2020
* @For : Download report PDF
* 
*/


module.exports.downloadPdf = async function (req, res) {
    try {
        let resultData = req.body
        let fileName = await pdfUtils.generatePDF(resultData);
        res.download(fileName, function (e) {
            if (e) {
                errorlog.error(`An error occurred in pdf download : ${e}`);
                res.status(500).json({ message: messages.toastr.PDF_DOWNLOAD_FAILD });
            }
            fs.unlinkSync(fileName);
        })
    } catch (error) {
        res.status(500).json({ message: messages.toastr.SERVER_ERROR });
        errorlog.error(httpStatus.SERVER_ERROR + " : " + error);

    }
}

/**
* 
* @author : Pankaj jha
* @date :  01-01-2020
* @For : Download excels for report
* 
*/

exports.downloadXLS = async function (req, res) {
    try {
        let tableData = req.body;

        let fileName = await excelUtils.generateXLSFile(tableData);
        res.download(fileName, function (e) {
            if (e) {
                errorlog.error(`An error occurred in xls download : ${e}`);
                res.status(500).json({ message: messages.toastr.XLS_DOWNLOAD_FAILD });
            }
            fs.unlinkSync(fileName);
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: messages.toastr.SERVER_ERROR });
        errorlog(httpStatus.SERVER_ERROR + " : " + error);

    }
}



/**
* 
* @author : Pankaj jha
* @date :  30-12-19
* @For : Generating reports
* 
*/

exports.generateReports = async function (req, res) {
    try {
        // return
        let requestData = req.body;
        let responseData = {};
        let monitoredRecored;
        let monitoredRecoredGraph;
        let selfPulls;
        let selfPullsDate;
        let alertTransaction;
        let billingReports;
        let alertCommission;
        let alertSummary;
        let impCommission;
        let grandMonitorRecord;
        let grandSelfPull;
        let grandAlert;
        let engageBilling;
        let referralCommission;

        //Get the reports heading
        let heading = await reporthelper.reportHeading(requestData);

        let monitoredIdentifier = requestData.reportType == "totalMonitoredRecords" ? "Added" : "Deleted";
        /**
        * Initially, we will fetch the information of the entity.
        * The entity can be either the stikum's `client` or
        * the stikkum's `partner`
        */
        let entityInfo = await reportDAO.getEntityInfo(requestData);

        if (requestData.branchId != '') requestData.clientId = requestData.branchId;

        //Calculation of date
        let range = await reporthelper.evaluateDateRange(requestData);

        let grandRange = {};
        grandRange.start = moment(requestData.enrollDate).format('YYYY-MM-DD');
        grandRange.end = moment(new Date()).format('YYYY-MM-DD');

        //Total monitored and deleted monitored records
        if (requestData.reportCategory == "monitoring" && requestData.reportType == "totalMonitoredRecords" || requestData.reportType == "deletedRecords") {
            monitoredRecored = await reportDAO.monitoredRecords(requestData, range, monitoredIdentifier);
            grandMonitorRecord = await await reportDAO.monitoredRecords(requestData, grandRange, monitoredIdentifier)
            monitoredRecoredGraph = await reportDAO.monitoredRecordGraph(requestData, range, monitoredIdentifier);
        }

        if (requestData.reportCategory == "monitoring" && requestData.reportType == "selfPulls") {
            selfPulls = await reportDAO.selfPullRecords(requestData, range);
            grandSelfPull = await reportDAO.selfPullRecords(requestData, grandRange);

            selfPullsDate = await reportDAO.selfPullsDate(requestData, range);
        }

        if (requestData.reportCategory == "transaction" && requestData.reportType == "alerts" && requestData.reportFor == 'admin') {
            alertSummary = await reportDAO.alertSummary(requestData, range);
            grandAlert = await reportDAO.alertSummary(requestData, grandRange);

        }

        if (requestData.reportCategory == "billing" && requestData.reportFor == 'admin') {

            billingReports = await reportDAO.adminBillingSummary(requestData, range);
            billingReports = await reportDAO.getCurrentPricing(JSON.parse(JSON.stringify(billingReports)));
            let filter = await reporthelper.overallSummaryFilter(requestData);
            engageBilling = await reportDAO.engageBillingSummary(filter);

        }

        if (requestData.reportCategory == "transaction" && requestData.reportType == "alerts" && requestData.reportFor != 'admin') {

            alertTransaction = await reportDAO.alertTransaction(requestData, range);
            grandAlert = await reportDAO.alertSummary(requestData, grandRange);

        }

        if (requestData.reportCategory == "billing" && requestData.reportType == "" && requestData.reportFor != 'admin') {
            billingReports = await reportDAO.billingReports(requestData, range);
            if (billingReports.length) {
                billingReports = await reportDAO.getLoName(JSON.parse(JSON.stringify(billingReports)));
            }
            // engage Billing
            let filter = await reporthelper.overallSummaryFilter(requestData);
            engageBilling = await reportDAO.engageBillingSummary(filter, requestData.clientId);
        }

        if (requestData.reportCategory == "commission" && requestData.reportType == "alerts") {
            alertCommission = await reportDAO.alertCommission(requestData, range);
        }

        if (requestData.reportCategory == "commission" && requestData.reportType == "implementation") {
            impCommission = await reportDAO.impCommission(requestData, range);
        }

        if (requestData.reportCategory == "commission" && requestData.reportType == "") {
            referralCommission = [];
            // if time period today
            if (requestData.timePeriod == 'date') {
                partnerPricing = await reportDAO.getPartnerCurrentPricing(requestData.partnerId);

                let clients = await reportDAO.getTotalClient(requestData.partnerId, range);
                clients = JSON.parse(JSON.stringify(clients));
                if (clients) {
                    for (let i = 0; i < clients.length; i++) {
                        clients[i].partnerRate = partnerPricing.value2;
                        referralCommission.push(clients[i])
                    }
                }
            } else {
                partnerPricing = await reportDAO.getPartnerPricing(requestData.partnerId, range);
                for (let j = 0; j < partnerPricing.length; j++) {
                    filter = {};
                    let start = partnerPricing[j].createdAt;
                    let end;
                    if (partnerPricing[j + 1]) {
                        end = partnerPricing[j + 1].createdAt;
                        end = moment(end).add(-24, 'hours');
                    } else {
                        if (requestData.timePeriod == 'date') {
                            end = new Date();
                        } else {
                            end = range.end;
                        }
                    }

                    if (moment(range.start).isSameOrAfter(start) && requestData.timePeriod != 'date') {
                        start = range.start
                    }
                    start = moment(start).format('YYYY-MM-DD');
                    end = moment(end).format('YYYY-MM-DD');
                    filter.start = start;
                    filter.end = end;

                    let clients = await reportDAO.getTotalClient(requestData.partnerId, filter);
                    clients = JSON.parse(JSON.stringify(clients));
                    if (clients) {
                        for (let i = 0; i < clients.length; i++) {
                            clients[i].partnerRate = partnerPricing[j].value2;
                            referralCommission.push(clients[i])
                        }
                    }
                }
            }
        }

        responseData = await reporthelper.adminReport(requestData, monitoredRecored, monitoredIdentifier, monitoredRecoredGraph, selfPulls, selfPullsDate, alertTransaction, billingReports, alertCommission, alertSummary, impCommission, entityInfo, grandMonitorRecord, grandSelfPull, grandAlert, engageBilling, referralCommission);

        responseData.heading = heading;
        res.status(httpStatus.OK).json({ responseData });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: messages.toastr.SERVER_ERROR });
        errorlog.error(`Error Occur in generate reports : ${error}`);

    }
}


/**
 * @author : Pankaj
 * @date : 16-01-2020
 * @description : Dashboard report summary
 * 
 */

exports.reportSummary = async function (req, res) {

    try {

        let requestData = req.query;

        let responseData = {};

        //Calculation of date
        let range = await reporthelper.customsDateRange(requestData);

        switch (requestData.reportType) {
            case "alerts":

                responseData = await reportDAO.adminAlertSummary(requestData, range);
                responseData = await reporthelper.reportSummary(requestData, responseData, range);
                break;

            case "billings":

                responseData = await reportDAO.adminBillingSummary(requestData, range);
                responseData = await reportDAO.getCurrentPricing(JSON.parse(JSON.stringify(responseData)));
                //Calculation of date
                let filter = await reporthelper.overallSummaryFilter(requestData);
                engageBilling = await reportDAO.engageBillingSummary(filter);
                responseData = await reporthelper.reportSummary(requestData, responseData, engageBilling);


                break;

            case "monitoring":

                responseData = await reportDAO.adminMoniteredSummary(requestData, range);
                // responseData = await reportDAO.getMonitorGrandTotal(JSON.parse(JSON.stringify(responseData)))
                responseData = await reporthelper.reportSummary(requestData, responseData, range);

                break;

            case "byState":

                if (requestData.state == 'All') {
                    responseData = await reportDAO.endUserByAllState(requestData, range);
                } else {
                    responseData = await reportDAO.endUserBystate(requestData, range);
                }
                responseData = await reporthelper.reportSummary(requestData, responseData, range);


                break;

        }

        res.status(httpStatus.OK).json({ responseData })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: messages.toastr.SERVER_ERROR });
        errorlog.error(`Error Occur in generate reports summary : ${error}`);
    }

}


/**
* 
* @author : pankaj
* @date : 20-12-2019
* @description : Admin dashboard alert summary
* 
*/

exports.alertSummary = async function (req, res) {

    try {
        //Get paramerters and store in requestData variable
        let requestData = req.query;
        var responseData;

        //Calculation of date
        let range = await reporthelper.evaluateDateRange(requestData);

        // Get Total alert from DAO
        responseData = await reportDAO.alertSummary(requestData, range);
        var borrowerInfo = responseData;

        //Calculation of date
        responseData = await reporthelper.alertSummary(requestData, responseData);

        res.status(httpStatus.OK).json({ borrowerInfo: borrowerInfo, responseData })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: messages.toastr.SERVER_ERROR });
        errorlog.error(httpStatus.SERVER_ERROR + " : " + error);
    }
}


/**
* 
* @author : pankaj
* @date : 20-12-2019
* @description : Admin dashboard active alerts
* 
*/

exports.activeAlerts = async function (req, res) {

    try {
        //Get paramerters and store in requestData variable
        let requestData = req.query;
        var responseData;

        //Calculation of date
        let range = await reporthelper.evaluateDateRange(requestData);

        // Get Total alert from DAO
        responseData = await reportDAO.activeAlerts(requestData, range);

        res.status(httpStatus.OK).json({ status: true, responseData })

    } catch (error) {
        res.status(500).json({ message: messages.toastr.SERVER_ERROR });
        errorlog.error(httpStatus.SERVER_ERROR + " : " + error);
    }
}



/**
* 
* @author : pankaj
* @date : 20-12-2019
* @description : Admin dashboard active alerts
* 
*/

exports.alertBillingHistory = async function (req, res) {

    try {
        let requestData = req.query;
        let responseData = [];
        //Calculation of date
        let range = await reporthelper.customsDateRange(requestData);

        let clientData = [];
        parentData = {
            clientId: requestData.clientId,
            isParent: requestData.isParent,
            companyName: requestData.companyName
        }
        clientData.push(parentData)

        let getChildClient = await brokerDao.clientBranchDetails(requestData.clientId);
        for (let i = 0; i < getChildClient.length; i++) {
            childData = {
                clientId: getChildClient[i].id,
                companyName: getChildClient[i].legalName,
                isChild: true
            }
            clientData.push(childData)
        }

        for (let i = 0; i < clientData.length; i++) {
            let alertBilling = await reportDAO.alertBillingHistory(clientData[i].clientId);
            for (let j = 0; j < alertBilling.length; j++) {
                let start = alertBilling[j].createdAt;
                let end;
                if (alertBilling[j + 1]) {
                    end = alertBilling[j + 1].createdAt;
                    end = moment(end).add(-24, 'hours');
                } else {
                    if (requestData.timePeriod == 'All') {
                        end = new Date();
                    } else {
                        end = range.end;
                    }
                }
                start = moment(start).format('YYYY-MM-DD');

                if (moment(range.start).isSameOrAfter(start) && requestData.timePeriod != 'All') {
                    start = range.start
                }

                end = moment(end).format('YYYY-MM-DD');
                let filter = await reporthelper.overallSummaryFilter(requestData);
                let engageBilling = await reportDAO.engageBillingSummary(filter, clientData[i].clientId);
                engageBilling = JSON.parse(JSON.stringify(engageBilling));
                if (engageBilling.length) {
                    engageAmount = engageBilling[0].amount;
                } else {
                    engageAmount = '--';
                }
                let totalAlertCount = await reportDAO.alertCountHistory(clientData[i].clientId, start, end);
                if (totalAlertCount) {
                    responseData.push({ 'engageBilling': engageAmount, 'alertBilling': alertBilling[j].Pricing, 'totalAlert': totalAlertCount, 'isParent': clientData[i].isParent, 'isChild': clientData[i].isChild, 'companyName': clientData[i].companyName });
                }
            }
        }
        res.status(httpStatus.OK).json({ responseData });
    } catch (error) {
        res.status(500).json({ message: messages.toastr.SERVER_ERROR });
        errorlog.error(httpStatus.SERVER_ERROR + " : " + error);
    }

}


