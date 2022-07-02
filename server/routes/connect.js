var express = require('express');
var router = express.Router();
const accessController = require('../controller/connect/access-log');
let pricingController = require('../controller/connect/pricing');
let paymentController = require('../controller/connect/payment');
const borrowerController = require('../controller/connect/borrower')
const promotionController =require('../controller/connect/promotion');
const dashboardController  =require('../controller/connect/dashboard'); 
const partnerController = require('../controller/connect/partner')
const BrokerController = require('../controller/connect/broker');
const multer = require('multer');
const upload = multer({ dest: 'uploads' })

const JWT =require('../utils/authentication');

/**
 * Access Log
 */
router.get('/access-log',JWT.authenticate, accessController.accessLog);
/**
 * Pricing
 */
router.get('/pricing',JWT.authenticate, pricingController.getStikkumPricing);
router.put('/pricing/:id',JWT.authenticate, pricingController.updatePricing);

/**
 * payment
 */

router.post('/payment/card-details',JWT.authenticate, paymentController.addCardDetails);
router.get('/payment/card-details/:clientId',JWT.authenticate, paymentController.getCardDetails);
router.put('/payment/card-detail/:paymentCredentialId',JWT.authenticate, paymentController.updatePrimaryCard);
router.delete('/payment/card-detail/:paymentCredentialId',JWT.authenticate, paymentController.deleteCardDetails);
router.post('/payment/isv-payment',JWT.authenticate, paymentController.addISVpayment);
router.get('/payment/billing-details/:clientId',JWT.authenticate, paymentController.getbillingdetail);


/**
 * Broker
 */

router.get('/clients',JWT.authenticate, BrokerController.getClientList);
router.get('/client/:id',JWT.authenticate, BrokerController.viewClientById);
router.put('/clients/update-partner/:id',JWT.authenticate, BrokerController.updateClientPartnerById);
router.get('/note/:id',JWT.authenticate, BrokerController.getNoteByClientId);
router.post('/note',JWT.authenticate, BrokerController.addNotes);
router.put('/note/:id',JWT.authenticate, BrokerController.updateNoteById);
router.delete('/note/:id',JWT.authenticate, BrokerController.deleteNoteById);
router.put('/user', JWT.authenticate, BrokerController.editUser);
router.post('/user', JWT.authenticate, BrokerController.addUser);
router.put('/client', JWT.authenticate, BrokerController.updateClientById);
router.post('/branch/preliminary-temporay-data',JWT.authenticate, BrokerController.addBranchInfo);
router.delete('/branch/preliminary-temporay-data/:id',JWT.authenticate, BrokerController.deleteBranchInfoById);
router.put('/payment/payment-credential', JWT.authenticate, BrokerController.updatePaymentById);
router.post('/pricing',JWT.authenticate, BrokerController.updatePricing);
router.get('/client/pricing-history/:clientId',JWT.authenticate, BrokerController.getPricingHistory);
router.post('/client/request-additional-document',JWT.authenticate, BrokerController.requestAdditionalDocuments);
router.put('/client/subscription',JWT.authenticate, BrokerController.updateFeatureSubscription);
router.post('/upload-site-inspection',JWT.authenticate,[upload.array('siteInpectionDoc')],BrokerController.uploadSiteInspection);
router.put('/client/enrollment-status/:id', JWT.authenticate, BrokerController.updateEnrollmentStatus);
router.get('/getUsersByClientId',JWT.authenticate, BrokerController.getUsersDataByClientId);
router.get('/client-info-for-template', JWT.authenticate, BrokerController.getClientInfoForTemplate)
router.get('/getUsersByClientId',JWT.authenticate, BrokerController.getUsersDataByClientId);
router.delete('/client',JWT.authenticate, BrokerController.deleteClient);
router.get('/branch',JWT.authenticate, BrokerController.clientBranchDetails);
router.delete('/document/:id',JWT.authenticate, BrokerController.deleteDocumentById);
router.put('/branch/preliminary-temporay-data',JWT.authenticate, BrokerController.updateAdditionalSiteInspection);
router.post('/profile-picture',JWT.authenticate, [upload.array('profilePic')], BrokerController.profilePicture);
// router.delete('/branch/preliminary-temporay-data',JWT.authenticate, BrokerController.deleteAdditionalSiteInspection);
router.delete('/profile-picture',JWT.authenticate, BrokerController.deleteProfilePicture);
router.get('/partner-by-type',JWT.authenticate, BrokerController.getPartnerListByType);


/**
 * Access Log
 */
//router.get('/States', miscController.getState);
//router.get('/Cites', miscController.getCity);

/**
 *  Borrower
 */
router.post('/borrower',JWT.authenticate, borrowerController.addBorrower);
router.get('/alert-statuses',JWT.authenticate, borrowerController.getStatus);
router.put('/borrower',JWT.authenticate, borrowerController.editBorrower);
router.get('/borrower',JWT.authenticate, borrowerController.getBorrowerById);
router.post('/borrower-database',JWT.authenticate,  [upload.single('xlsx')], borrowerController.uploadBorrowerDatabaseFile);
router.get('/borrowers',JWT.authenticate, borrowerController.getBorrowersList);
router.delete('/borrowers',JWT.authenticate, borrowerController.deleteBorrowers);
router.get('/self-pulls',JWT.authenticate, borrowerController.getSelfPullData);
router.post('/status-log',JWT.authenticate, borrowerController.createAlertLog);
router.post('/self-pull',JWT.authenticate, borrowerController.selfPullBorrower);
router.delete('/alert',JWT.authenticate, borrowerController.deleteAlert);
router.get('/alerts',JWT.authenticate, borrowerController.getAlerts);
router.put('/status-remark',JWT.authenticate, borrowerController.updateSAlertStatusRemark);
router.get('/fico-scores',JWT.authenticate, borrowerController.getFicoScores);
router.post('/snooze',JWT.authenticate, borrowerController.snoozedBorrrower);
router.get('/snooze',JWT.authenticate, borrowerController.getSnoozedBorrower);
router.put('/snooze',JWT.authenticate, borrowerController.editSnoozedBorrrower);

/**
 * @author Harinder Katiyar
 * @description Promotion Module Routes
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */

router.get('/promocode/exists',JWT.authenticate,promotionController.checkExistingPromocode);
router.post('/promocode',JWT.authenticate, promotionController.addPromocode);
router.get('/promocodes', JWT.authenticate ,promotionController.getAllPromocodeData);
router.get('/promocode/:promocodeId',JWT.authenticate,promotionController.getPromocodeById);
router.delete('/promocode/:promocodeId',JWT.authenticate , promotionController.deletePromocodeById);

router.put('/promocode',JWT.authenticate,promotionController.editPromocode);

/**
 * @author Harinder Katiyar
 * @description Dashboard Module Routes
 * @todo (If Required) : We need to make this function reusable.
 * @summary A complete summary if required.
 */

require('../models')
router.post('/addData/:param',dashboardController.addData);//only for test purpose no use in apllicaion
router.get('/addData',dashboardController.addData);//only for test purpose no use in apllicaion

router.get('/alerts/:params',dashboardController.getTUAlertData);
router.get('/alerts/bar-chart-data/:params',dashboardController.getBarChartData);
router.get('/getAgeingChartData',JWT.authenticate,dashboardController.getAgeingChartData);

/**
 * @author aasif
 * @description Partner Module Routes
 */
router.post('/partner',JWT.authenticate, partnerController.addPartner);
router.get('/partner',JWT.authenticate, partnerController.getPartnerById);
router.get('/partner/link-extention-exists',JWT.authenticate, partnerController.checkLandingPageLinkExt);
router.get('/partner/special-link-extention-exists',JWT.authenticate, partnerController.checkSpecialLinkExt);
router.get('/partner/default-template',JWT.authenticate, partnerController.getAllTemplate);
router.put('/partner',JWT.authenticate, partnerController.editPartner);
router.get('/partners',JWT.authenticate, partnerController.getAllPartners);
router.get('/partnersList',JWT.authenticate, partnerController.getAllPartnersList);
router.post('/partner/generate-link',JWT.authenticate, partnerController.generateLink);
router.get('/partner/generate-links',JWT.authenticate, partnerController.getGeneratedLink);
router.get('/partner/generate-link',JWT.authenticate, partnerController.getGeneratedLinkById);
router.get('/partner/link-price',JWT.authenticate, partnerController.getLinkPrice);
router.post('/partner/share-link',JWT.authenticate, partnerController.shareGeneratedLink);
router.get('/partner/clients',JWT.authenticate, partnerController.getClientListOfPartner);
router.get('/partner/invited-clients',JWT.authenticate, partnerController.getInvitedClientData);
router.post('/partner/images',[upload.array('Image')], JWT.authenticate, partnerController.addImage);
router.post('/partner/agreement-document',[upload.array('document')], JWT.authenticate, partnerController.uploadDocument);



module.exports = router;
