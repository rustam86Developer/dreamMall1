const express = require("express");
const router = express.Router();
let reportController = require('../controller/common/report');
const helpController = require('../controller/common/help');
const preferencesController = require('../controller/common/preferences')
const commonController = require('../controller/common/common')
const miscellaneousController = require('../controller/common/miscellaneous');
const authenticationController = require('../controller/common/authentication');
const enrollmentController = require('../controller/common/enrollment');
const usermanagementController = require('../controller/common/usermanagement');
const uploadHelper = require('../helper/common/upload');
const smsTemplateController = require('../controller/common/sms-template');
const JWT = require('../utils/authentication');
const multer = require('multer');
const upload = multer({ dest: 'uploads' });


/** 
 * Preferences Routes
*/
router.post('/template', JWT.authenticate, preferencesController.addTemplate);
router.put('/template', JWT.authenticate, preferencesController.editTemplate);
router.delete('/template/:templateId', JWT.authenticate, preferencesController.deleteTemplateById);
router.get('/template/exists', JWT.authenticate, preferencesController.checkIfTemplateNameExists);
router.get('/templates', JWT.authenticate, preferencesController.getTemplates);
router.get('/template/default', JWT.authenticate, preferencesController.getDefaultTemplate);
router.put('/template/set-default', JWT.authenticate, preferencesController.setDefaultTemplate);
router.get('/preference', JWT.authenticate, preferencesController.getPreferences);
router.put('/preference', JWT.authenticate, preferencesController.updatePreferences);
router.get('/smtp-details', JWT.authenticate, preferencesController.getSMTP);
router.post('/smtp-details', JWT.authenticate, preferencesController.addSMTP);
router.get('/schedule-email', JWT.authenticate, preferencesController.getScheduleInfo);
router.post('/access-log', JWT.authenticate, commonController.updateAccessLog);
router.post('/auto-alert-Email', JWT.authenticate, preferencesController.scheduleAutoAlertEmail);
router.post('/alert-distribution', JWT.authenticate, preferencesController.addAlertDistributionData);
router.get('/alert-distribution', JWT.authenticate, preferencesController.getAlertDistributionData);
router.post('/schedule-sms-auto-alert', JWT.authenticate, preferencesController.scheduleSmsAutoAlert);
router.get('/sms-auto-alert', JWT.authenticate, preferencesController.getSmsAutoAlert);
router.get('/sms-default-template', JWT.authenticate, preferencesController.getSmsDefaultTemplate)
router.put('/sms-auto-alert', JWT.authenticate, preferencesController.updateSmsAutoAlertSubscription);
router.post('/deavtivate-auto-alert-sms', JWT.authenticate, preferencesController.deavtivateScheduledAutoAlertSms);
router.post('/deactivate-auto-alert-Email', JWT.authenticate, preferencesController.deactivateAutoAlertEmail);
router.put('/preferences/fico-score',JWT.authenticate,preferencesController.updateFicoScore);
/**
 * Sms Template Routes
 */
router.post('/sms-template', JWT.authenticate, smsTemplateController.addSmsTemplate);
router.get('/sms-templates/:clientId', JWT.authenticate, smsTemplateController.getSmsTemplates);
router.delete('/sms-template/:templateId', JWT.authenticate, smsTemplateController.deleteSmsTemplates);
router.put('/sms-template', JWT.authenticate, smsTemplateController.editSmsTemplate);
router.get('/broker-and-primary-contact/:clientId', JWT.authenticate, smsTemplateController.getBrokerAndPrimaryContact);


/**
 * @author Harinder Katiyar
 * @description Help Module Routes
 */
router.post('/help/faq', JWT.authenticate, helpController.addFaq);
router.post('/help/contact-us', JWT.authenticate, helpController.addContactUs); //This routes not now using because Ashish already has created common routes
router.post('/help/help-file', JWT.authenticate, [upload.array('file'), uploadHelper.renameUploadedTempFiles], helpController.addHelpFile);
router.post('/helps', JWT.authenticate, helpController.viewAllData);
router.get('/help/:id', JWT.authenticate, helpController.getHelpDataById);
router.put('/help/:id', JWT.authenticate, helpController.editHelpDataById);
router.delete('/help/:id', JWT.authenticate, helpController.deleteHelpDataById);


/**
 * Miscellaneous
 */
router.get('/states', miscellaneousController.getState);
router.get('/cities', miscellaneousController.getCity);
router.get('/state-city-id', miscellaneousController.getStateCityId);

/**
 * Authentication
 */
router.post('/generatePassword', authenticationController.generatePassword);
router.get('/number-of-users/:email', authenticationController.numberOfUsersByEmail)
router.post('/login', authenticationController.login);
router.post('/password/send-password-link', authenticationController.sendPasswordLink);
router.put('/password/set-password', authenticationController.setPassword);
router.put('/password/change-password', JWT.authenticate, authenticationController.changePassword);
router.get('/user/reset-password-link', authenticationController.resendPasswordGenerationLink)
router.get('/valid-token/:token', authenticationController.checkIfValidToken)
router.get('/client-by-user/:token', authenticationController.getClientByUserId)
router.get('/user/email/:userId', authenticationController.getEmailByUserId)
router.get('/branchClient/:clientId', authenticationController.branchClientById)




/**
 *  User Management Module Routes
 */
router.get('/sub-modules', JWT.authenticate, usermanagementController.getSubmodules);
router.get('/modules', JWT.authenticate, usermanagementController.getModules);
router.post('/user', JWT.authenticate, usermanagementController.addUser);
router.delete('/user', JWT.authenticate, usermanagementController.deleteUser);
router.get('/user', JWT.authenticate, usermanagementController.getUser);
router.post('/role', JWT.authenticate, usermanagementController.assignAccessRight);
router.delete('/role', JWT.authenticate, usermanagementController.deleteRole);
router.put('/user', JWT.authenticate, usermanagementController.editUser);
router.put('/role', JWT.authenticate, usermanagementController.editAccessRight);
router.get('/roles', JWT.authenticate, usermanagementController.getRole);
router.get('/role/exists', JWT.authenticate, usermanagementController.checkIfRoleExists);

/**
 * Common
  */
router.get('/user/exists', JWT.authenticate, commonController.checkUserEmail); // Done 
router.get('/branch/exists', JWT.authenticate, commonController.checkBranchEmail); // Done 
router.put('/updateClientStatus', JWT.authenticate, commonController.updateClientStatus)

/**
 * Enrollment
 */

router.post('/enroll', enrollmentController.addEnrollment);
router.post('/same-billing', enrollmentController.addSameBillingEnrollment);
router.put('/enroll/site-inspection', enrollmentController.addSiteInspection);
router.post('/enroll/upload-enroll-document', [upload.array('enrollmentDocs'), uploadHelper.renameUploadedTempFiles], enrollmentController.uploadEnrollmentDocument);
router.get('/enrollment/pricing', enrollmentController.getPricing);
router.get('/enrollment/partner-by-link-extension/:linkExt', enrollmentController.getPartnerByLinkExtension);
router.get('/enrollment/special-link/:specialLink', enrollmentController.getSpecialLinkInfo);
router.get('/enrollment/isv-temp-data/:token', enrollmentController.getISVTempData);
router.get('/enrollment/preliminary-temporay-data/:token', enrollmentController.getParentIdByToken);
router.get('/landing-page/:linkExtension', enrollmentController.getLandingPageInfo);
router.post('/contact-us', enrollmentController.saveContactUs);
router.get('/client-type', enrollmentController.getClientType);
router.get('/business-classification', enrollmentController.getBusinessClassification);

/**
 * Landing Pages
 */

router.post('/landing-page-fico-subscribe', commonController.subscribeFICO);
router.post('/landing-page-engage-subscribe', commonController.subscribeEngage);



/**
 * 
 * @author : Pankaj
 * @date : 19-12-2019
 * @description : Report Routes
 * 
 */

router.post('/report/search-criteria', JWT.authenticate, reportController.searchCriteria);
router.get('/report/search-criterias', JWT.authenticate, reportController.searchCriterias);
router.get('/report/autocomplete-data', JWT.authenticate, reportController.autocompleteData);
router.delete('/report/search-criteria/:id', JWT.authenticate, reportController.deleteSearchCriteria);
router.get('/report/partner-info/:id', JWT.authenticate, reportController.partnerInfo);
router.get('/report/client-info/:id', JWT.authenticate, reportController.clientInfo);
router.get('/report/overall-summary-counts', JWT.authenticate, reportController.overallSummaryCounts);
router.post('/report/export-to-pdf', JWT.authenticate, reportController.downloadPdf);
router.post('/report/export-to-excel', JWT.authenticate, reportController.downloadXLS);
router.post('/report/generate', JWT.authenticate, reportController.generateReports);
router.get('/report/report-summary', JWT.authenticate, reportController.reportSummary);
router.get('/report/alert-summary', JWT.authenticate, reportController.alertSummary);
router.get('/report/active-alerts', JWT.authenticate, reportController.activeAlerts);
router.get('/report/billing-history', JWT.authenticate, reportController.alertBillingHistory);

module.exports = router;