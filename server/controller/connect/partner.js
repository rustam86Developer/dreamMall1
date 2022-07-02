
const errorLog = require('../../helper/common/logger').errorLog;
const dao = require('../../dao/connect/partner');
const httpStatus = require('../../helper/utilities/http-status');
const messages = require('../../helper/utilities/messages');
const emailHelper = require('../../helper/common/email')
const constants = require('../../helper/utilities/constants');
const crypto = require('crypto');
const uuidAPIKey = require('uuid-apikey');
const model = require('../../models');
const helper = require('../../helper/connect/partner');
const uploadHelper = require('../../helper/common/upload');
const paymentHelper = require('../../helper/connect/payment')
const moment = require('moment');
var senderEmail = CONFIG.SMTP.SENDER;

module.exports.addPartner = async function (req, res) {
    let transaction;

    try {
        transaction = await model.sequelize.transaction();
        var key = uuidAPIKey.create();
        // partner type ISV then add API key
        if (req.body.partner.systemUserTypeId == constants.systemUserType.ISV) {
            req.body.partner.apiKey = key.apiKey;
        }
        var token = crypto.randomBytes(16).toString('hex')
        let userTokenObj = {
            purpose: 'password',
            token: token,
            expiresAt: moment().utc().add(1, 'days').format()
        }
        req.body.userToken = userTokenObj;

        let partnerInfo = {};
        partnerInfo = await dao.addPartner(req.body, transaction)

        helper.sendMail(partnerInfo)
        await transaction.commit();
        res.status(httpStatus.OK).json({ status: true, message: messages.toastr.PARTNER_ADDED, partnerId: partnerInfo.partnerData.id })
    } catch (error) {
        transaction.rollback();
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error occured while adding partner : ${error},`);
    }
}

//check & validate duplicate landing page link ext
exports.checkLandingPageLinkExt = async function (req, res) {
    try {
        let result = await dao.checkLandingPageLinkExt(req.query.linkExt)
        if (result) {
            res.status(httpStatus.OK).json({ status: true, message: messages.toastr.LINK_EXT_EXIST })
        } else {
            res.status(httpStatus.OK).json({ status: false })
        }

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occured in Check Duplicate Landing Page Link Extension: ${error}`);
    }
}

//check & validate duplicate landing page link ext
exports.checkSpecialLinkExt = async function (req, res) {
    try {
        let result = await dao.checkSpecialLinkExt(req.query.linkExt)
        if (result) {
            res.status(httpStatus.OK).json({ status: true, message: messages.toastr.LINK_EXT_EXIST })
        } else {
            res.status(httpStatus.OK).json({ status: false })
        }

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occured in Check Duplicate Landing Page Link Extension: ${error}`);
    }
}

// Details get all template
module.exports.getAllTemplate = async function (req, res) {
    try {
        let allTemplate = await dao.getAllTemplate();
        res.status(httpStatus.OK).json(allTemplate);
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorlog.error(`Error Occur In get All Template Name`);
    }
}

//Get stikkum partnerById
module.exports.getPartnerById = async function (req, res) {
    try {
        let partnerDetails = await dao.getPartnerById(req.query.id);
        res.status(httpStatus.OK).json(partnerDetails);

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur in Get Partner By Id  : ${error}`);

    }
}

/**
 * Edit Partner Details
 */
module.exports.editPartner = async function (req, res) {
    let transaction;

    try {
        transaction = await model.sequelize.transaction();
        await dao.editPartner(req.query.id, req.body, transaction)
        await transaction.commit();
        res.status(httpStatus.OK).json({ message: messages.toastr.PARTNER_UPDATED });
    } catch (error) {
        transaction.rollback();
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur in Edit Partner : ${error}`);
    }

}

/**
 * Get All Stikkum Partner Details 
 */
module.exports.getAllPartners = async function (req, res) {
    try {
        let partnerList = await dao.getAllPartners();
        res.status(httpStatus.OK).json(partnerList);
    } catch (error) {

        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur in Edit Partner : ${error}`);
    }
}
/**
 * Get All Stikkum Partner Details For Client View DropDown
 */
module.exports.getAllPartnersList = async function (req, res) {
    try {
        let partnerListAll = await dao.getAllPartnersList();
        res.status(httpStatus.OK).json(partnerListAll);
    } catch (error) {

        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur in Edit Partner : ${error}`);
    }
}

/**
 * Generate Link For Partner 
 */
module.exports.generateLink = async function (req, res) {
    try {
        let linkStatus = await dao.generateLink(req.body);
        if (linkStatus) {
            if (req.body.loginAsAdmin) {
                req.body.mailConfig.from = senderEmail;
                emailHelper.sendMail(req.body.mailConfig, {
                    adminChangesMessage: messages.emailContent.ENROLL_LINK,
                }, '', messages.emailCases.ENROLL_LINK)
            }
            res.status(httpStatus.OK).json({ status: true, message: messages.toastr.LINK_GENERATED });

        } else {
            res.status(httpStatus.OK).json({ status: false, message: messages.toastr.SAME_PRICE_ALREADY_EXIST });
        }
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur in generate link : ${error}`);
    }
}

/**
 * Get Generated Link List
 */
module.exports.getGeneratedLink = async function (req, res) {
    try {
        let generatedLinkList = await dao.getGeneratedLink(req.query.partnerId, req.query.statusId)
        res.status(httpStatus.OK).json({ generatedLinkList });

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occured In Getting Generated Link List: ${error}`);
    }
}

/**
 * Get Generated Link List
 */
module.exports.getGeneratedLinkById = async function (req, res) {
    try {
        let linkDetails = await dao.getGeneratedLinkById(req.query.id, req.query.statusId)
        res.status(httpStatus.OK).json(linkDetails);

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occured In Getting Generated Link Details: ${error}`);
    }
}

/**
 * Get Generated Link price 
 */

module.exports.getLinkPrice = async function (req, res) {
    try {
        let linkPrice = await dao.getLinkPrice(req.query.partnerId)
        res.status(httpStatus.OK).json(linkPrice);
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occured In Getting Generated Link Price: ${error}`);
    }
}

/**
 * Get Client List Of Partner
 */
module.exports.getClientListOfPartner = async function (req, res) {
    try {

        let partnerClientList = await dao.getClientListOfPartner(req.query.partnerId, req.query.statusId)
        res.status(httpStatus.OK).json({ partnerClientList });
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occured in Getting Partner Client List : ${error}`);
    }
}

/**
 * ISA Invited client data which didn't enrolled yet
 *  */
module.exports.getInvitedClientData = async function (req, res) {
    try {
        let isaInvitedClientData = await dao.getInvitedClientData(req.query.partnerId)
        res.status(httpStatus.OK).json({ isaInvitedClientData });
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occured In Getting Partner Invited Client List : ${error}`);
    }
}

/**
 * 
 */
//upload logo in s3
module.exports.addImage = async function (req, res) {
    try {
        var partnerId = req.body.partnerId;
        var logo;
        var profilePic;
        var remoteLogo;
        var remoteProfile;
        var docInfo = {
            partnerId: partnerId,
        }

        //upload Logo
        if (req.body.logoImage) {

            logo = crypto.randomBytes(16).toString('hex');
            localPath = 'uploads/' + logo;
            remoteLogo = CONFIG.PARTNER_LOGO_IMAGE + partnerId + '/' + logo;
            let base64Image = req.body.logoImage.split(';base64,').pop();
            await helper.convertToImage(logo, base64Image);
            await uploadHelper.uploadDataToS3(localPath, remoteLogo);
            docInfo.logoName = logo;
            if (req.body.oldLogo) {
                await uploadHelper.deleteFromAwsS3(CONFIG.PARTNER_LOGO_IMAGE + partnerId + '/' + req.body.oldLogo);
            }
        }
        //upload profile
        if (req.body.profileImage) {
            let base64Image = req.body.profileImage.split(';base64,').pop();
            profilePic = crypto.randomBytes(16).toString('hex');
            let localPath = 'uploads/' + profilePic;
            remoteProfile = CONFIG.PARTNER_PROFILE_IMAGE + partnerId + '/' + profilePic;
            await helper.convertToImage(profilePic, base64Image);


            await uploadHelper.uploadDataToS3(localPath, remoteProfile);
            docInfo.profilePicName = profilePic;
            if (req.body.oldProfile) {
                await uploadHelper.deleteFromAwsS3(CONFIG.PARTNER_PROFILE_IMAGE + partnerId + '/' + req.body.oldProfile);
            }
        }
        // add Image into database
        await dao.addImage(docInfo);
        res.status(httpStatus.OK).json({ status: true, message: messages.toastr.IMAGE_UPLOADED });
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occured In Upload Logo: ${error}`);
    }

}
/**
 * Upload Partner Agreement Document
 */
module.exports.uploadDocument = async function (req, res) {
    try {
        console.log(req.body)
        for (i = 0; i < req.files.length; i++) {
            let paths = [];
            let name = req.files[i].originalname;
            let remote = CONFIG.PARTNER_DOCUMENT + req.body.partnerId + '/' + req.files[i].originalname;
            paths.push({ local: req.files[i].path, remote: remote, filename: req.files[i].originalname })

            //Upload file in S3
            await uploadHelper.distributeProcessAndUploadFiles(paths);
            let docInfo = {
                name: name,
                partnerId: req.body.partnerId,
                path: remote
            }
            await dao.saveDocument(docInfo)
        }

        res.status(httpStatus.OK).json({ status: true, message: messages.toastr.DOCUMENT_UPLOADED });

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occured In Upload Partner Aggrement: ${error}`);
    }
}

/**
 * Share Link To Email
 */
module.exports.shareGeneratedLink = async function (req, res) {
    try {
        let response = await dao.shareGeneratedLink(req.body.shareLinkData);
        //send email
        if (response.length > 0) {

            for (let i = 0; i < response.length; i++) {
                var email = response[i].email;
                var enrollmentLink = req.body.shareLinkData[i].specialLink;
                const mailConfig = {
                    from: senderEmail,
                    to: email,
                    subject: messages.emailSubject.ENROLLMENT_LINK
                }
                emailHelper.sendMail(mailConfig, { link: enrollmentLink, email: email }, messages.emailType.ISA_ENROLLMENT_CLIENT)
            }
        }
        res.status(httpStatus.OK).json({ message: messages.toastr.LINK_SEND });

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occured In Sharing Link: ${error}`);
    }
}
