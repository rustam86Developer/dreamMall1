const express = require("express");
const router = express.Router();
const engageController = require('../controller/engage/communication');
const controller = require('../controller/engage/engage');
const JWT = require('../utils/authentication');
var twilio = require('twilio');

// comunication
router.post('/sms', JWT.authenticate, engageController.sendSms);
router.get('/template', JWT.authenticate, engageController.getTemplate);
router.post('/email-log', JWT.authenticate, engageController.createEmailContentLog);
router.get('/comm-log', JWT.authenticate, engageController.getCommunicationLogs);
router.get('/borrower-logs', JWT.authenticate, engageController.getBorrowerLogs);
router.get('/email-log', JWT.authenticate, engageController.getEmailLogs);
router.get('/logs', JWT.authenticate, engageController.getLogsForSingleClient);
router.post('/mass-email', JWT.authenticate, engageController.sendMassEmail);
router.post('/status', JWT.authenticate, twilio.webhook({ validate: false }), engageController.smsStatusCallback);
router.post('/email', JWT.authenticate, engageController.sendEmail);

router.post('/client', JWT.authenticate, engageController.getClientListForCommunication);

/*******Engage Scheduled Process Routes********* */
router.post('/schedule-process', JWT.authenticate, controller.addScheduledProcess);
router.get('/schedule-process', JWT.authenticate, controller.getScheduledProcessesList);
router.delete('/scheduled-process', JWT.authenticate, controller.deleteScheduledProcesses);

router.post('/engage-subscription', JWT.authenticate, controller.engageSubscription);
router.get('/engage-subscription', JWT.authenticate, controller.getEngageSubscribedDetails);

router.post('/run-scheduled-sms', engageController.runScheduledSms);
router.post('/run-scheduled-auto-alert-sms', engageController.runScheduledAutoAlertSms);
router.post('/send-real-time-alerts-sms', engageController.sendRealTimeAlertSms);
router.post('/schedule-sms', JWT.authenticate, controller.scheduleSms)

module.exports = router;



