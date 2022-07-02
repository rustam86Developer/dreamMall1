const dao = require('../../dao/common/help')
const helpHelper = require('../../helper/common/help');
const errorLog = require('../../helper/common/logger').errorLog;
const uploadDoc = require('../../helper/common/upload');
const messages = require('../../helper/utilities/messages');
const httpStatus = require('../../helper/utilities/http-status');
const constants = require('../../helper/utilities/constants')


/**
 * @author Harinder Katiyar
 * @description  Add FAQ question in help modules
 */
exports.addFaq = async function (req, res) {
    try {
        await dao.addFaq(req.body)
        res.status(httpStatus.OK).json({ message: messages.toastr.FAQ_ADDED })
    }
    catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error occured while adding FAQ: ${error}`);
    }
}

/**
 * @author Harinder Katiyar
 * @description  Add contactus in help modules
 */
exports.addContactUs = async function (req, res) {
    try {
        helpHelper.sendEmail(req.body);
        await dao.addContactUs(req.body);
        res.status(httpStatus.OK).json({ message:messages.toastr.ADD_CONTACT_US})
    }
    catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error occured while adding contactUs : ${error}`);
    }
}

/**
 * @author Harinder Katiyar
 * @description  Add document and video in help modules
 */
exports.addHelpFile = async function (req, res) {
    try {
        mainObj = req.body;
           
         let localPath = req.files[0].path;
         var remotePath;
         var helpObj = {};

         if(mainObj.helpType == constants.helpType.DOCUMENT){
            remotePath = CONFIG.HELP_DOCUMENT+req.files[0].filename;
        
             helpObj = {
              
                addedFor : mainObj.addedFor,
                helpType: mainObj.helpType,
                documentTitle : mainObj.documentTitle,
                documentDescription : mainObj.documentDescription,
                documentOriginalName : req.files[0].originalname,
                documentModifiedName : req.files[0].filename
            }

         }
         else{
            remotePath = CONFIG.HELP_VIDEO+req.files[0].filename;
            
            helpObj = {
              
                addedFor : mainObj.addedFor,
                helpType: mainObj.helpType,
                videoTitle : mainObj.videoTitle,
                videoDescription : mainObj.videoDescription,
                videoOriginalName : req.files[0].originalname,
                videoModifiedName : req.files[0].filename
            }


         }
         let paths = [{local:localPath,remote:remotePath}]
         await uploadDoc.distributeProcessAndUploadFiles(paths);
         await dao.saveFileInformation(helpObj);
        res.status(httpStatus.OK).json({ helpType: req.body.helpType, message: (req.body.helpType == constants.helpType.VIDEO) ? messages.toastr.VIDEO_UPLOADED : messages.toastr.DOCUMENT_UPLOADED });
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error occured while uploading help document/Video: ${error}`);
    }
}

/**
 * @author Harinder Katiyar
 * @description  Find all data of help by id
 */
exports.getHelpDataById = async function (req, res) {
    try {
        let helpData = await dao.getHelpDataById(req.params.id)
        res.status(httpStatus.OK).json(helpData)
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error occured while finding help data: ${error}`);
    }
}

/**
 * @author Harinder Katiyar
 * @description   Update all help data by id
 */
exports.editHelpDataById = async function (req, res) {
    try {
        let message;
        await dao.editHelpDataById(req.params.id, req.body)
        // manage message of FAQ,VIDEO and DOCUMENT
        if (req.body.helpType == constants.helpType.FAQ) {
            message = messages.toastr.FAQ_UPDATED;
        } else if (req.body.helpType == constants.helpType.VIDEO) {
            message = messages.toastr.VIDEO_UPDATED;
        } else {
            message = messages.toastr.DOCUMENT_UPDATED;
        }
        res.status(httpStatus.OK).json({ message: message })
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error occured while updating Help Data: ${error}`);
    }
}

/**
 * @author Harinder Katiyar
 * @description Delete all data of help by id
 */
exports.deleteHelpDataById = async function (req, res) {
    try {
        var message;
        var helpData = await dao.getHelpDataById(req.params.id);
   
        if (helpData.helpType == constants.helpType.FAQ) {
            message = messages.toastr.FAQ_DELETED;
        } 
        if (helpData.helpType == constants.helpType.VIDEO) {
            message = messages.toastr.VIDEO_DELETED;
            let videoPath = CONFIG.HELP_VIDEO + helpData.videoModifiedName 
            await uploadDoc.deleteFromAwsS3(videoPath);
        }  
        if(helpData.helpType == constants.helpType.DOCUMENT){
            message = messages.toastr.DOCUMENT_DELETED;
            let documentPath = CONFIG.HELP_DOCUMENT + helpData.documentModifiedName
            await uploadDoc.deleteFromAwsS3(documentPath);
        }

        await dao.deleteHelpDataById(req.params.id)
        res.status(httpStatus.OK).json({ message: message})
    } catch (error) {
       
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error occured while Deleting Help Data: ${error}`);
    }
}

// view all data of help and supports
exports.viewAllData = async function (req, res) {
    try {

        let viewHelpAllData = await dao.viewAllData(req.body)
        res.status(httpStatus.OK).json(viewHelpAllData)
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error Occur in Get Help data : ${error}`);
    }
}
