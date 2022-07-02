const express = require("express");
const router = express.Router();
const borrowerController = require('../controller/connect/borrower')
const isvController = require('../controller/common/isv');
const multer = require('multer');
const upload = multer({ dest: 'uploads' })

router.post('/enrollIsvClient', isvController.addTemporaryDataOfIsvClient);
router.post('/checkIsvEnrollStatus', isvController.checkIsvClientEnrollmentStatus);
router.post('/uploadClientDatabase', [upload.single('db_xlsx')], borrowerController.uploadBorrowerDatabaseFile);
router.post('/registerCallbackEndpoint', isvController.registerIsvCallbackUrls);
router.post('/testAlertPushNotification', isvController.testAlertPushNotification);
router.post('/testEnrollStatusPushNotification', isvController.testEnrollStatusPushNotification);
router.post('/markSelfPulled', isvController.markSelfPulled);
router.post('/deleteClient', isvController.deleteBorrower);
router.post('/changeEnrollStatus', isvController.changeEnrollStatus);
router.get('/getStatesForIsv', isvController.getStatesForIsv);
router.get('/getCitiesForIsv', isvController.getCitiesForIsv);

// Test APIS
// TODO
module.exports = router;