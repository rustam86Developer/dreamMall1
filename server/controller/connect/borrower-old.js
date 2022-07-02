const borrowerDao = require('../../dao/connect/borrower')
const borrowerHelper = require('../../helper/connect/borrower')
const messages = require('../../helper/utilities/messages');
const errorLog = require('../../helper/common/logger').errorLog;
const helpHelper = require('../../helper/common/help');
const commonDao = require('../../dao/common/common');
const constants = require('../../helper/utilities/constants')
const upload = require('../../helper/common/upload')
const authenticationDao = require('../../dao/common/authentication')
const httpStatus = require('../../helper/utilities/http-status');



module.exports.addBorrower = async function (req, res) {
  let transaction;
  try {
    transaction = await commonDao.getSequelizeTransaction();

    let lastEntry = await commonDao.getLastEntry(constants.lastEntryType.BORROWER_REFERENCE_NUMBER, req.body.clientId);

    req.body.borrowerReferenceNumber = borrowerHelper.generateBorrowerReferenceNumber({
      clientId: req.body.clientId,
      lastCode: lastEntry ? parseInt(lastEntry.value.split('_')[1]) : 0
    });

    await commonDao.updateLastEntry({
      type: constants.lastEntryType.BORROWER_REFERENCE_NUMBER,
      clientId: req.body.clientId,
      value: req.body.borrowerReferenceNumber,
      isNew: lastEntry ? false : true
    }, transaction)

    await borrowerDao.insertBorrowers([req.body], transaction);

    await borrowerDao.updateBorrowerCountLog({ count: 1, clientId: req.body.clientId }, transaction);

    let groupedLos = borrowerHelper.groupAllLoEmails([req.body], req.body.clientId);

    await borrowerDao.saveLoUsers(groupedLos, transaction);


    await transaction.commit();

    res.status(httpStatus.OK).json({ message: messages.toastr.BORROWER_ADDED })
  } catch (error) {
    transaction.rollback();
    res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
    errorLog.error(`Error occured while adding borrower : ${error},`);
  }
}

module.exports.getStatus = async function (req, res) {
  try {
    let alertStatuses = await borrowerDao.borrowerStatus()
    res.status(httpStatus.OK).json(alertStatuses)
  } catch (error) {

    res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
    errorLog.error(`Error occured Get status : ${error},`);
  }
}


module.exports.editBorrower = async function (req, res) {
  try {
    await borrowerDao.editBorrower(req.body, req.query.borrowerId, req.query.clientId);
    res.status(httpStatus.OK).json({ message: messages.toastr.BORROWER_UPDATED })
  } catch (error) {
    res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
    errorLog.error(`Error occured while editing borrower : ${error},`);
  }

}


module.exports.getBorrowerById = async function (req, res) {
  try {
    let borrowerData = await borrowerDao.getBorrowerById(req.query.borrowerId, req.query.clientId)
    res.status(httpStatus.OK).json(borrowerData)
  } catch (error) {


    res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
    errorLog.error(`Error occured while viewing borrower : ${error},`);
  }
}

module.exports.getBorrowersList = async function (req, res) {
  try {
    let query = borrowerHelper.generateSearchQuery(req.query.key);
    req.query.key = query;
    let borrowersData = await borrowerDao.getBorrowerList(req.query, false)
    let totalClients = await borrowerDao.getNumberOfBorrowers(req.query);
    res.status(httpStatus.OK).json({ borrowers: borrowersData, totalBorrowers: totalClients })
  } catch (error) {
    res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
    errorLog.error(`Error occured while getting borrowerList : ${error},`);
  }
}


module.exports.deleteBorrowers = async function (req, res) {
  let transaction;
  try {
    transaction = await commonDao.getSequelizeTransaction();
    await borrowerDao.deleteBorrowers(req.body.ids, transaction)
    await borrowerDao.updateBorrowerCountLog({ count: - req.body.ids.length, clientId: req.body.clientId }, transaction)
    await transaction.commit();
    res.status(httpStatus.OK).json({ message: messages.toastr.BORROWER_DELETED })
  }
  catch (error) {
    await transaction.rollback();
    res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
    errorLog.error(`Error occured while deleting borrowers : ${error},`);
  }
}


module.exports.getSelfPullData = async function (req, res) {
  try {
    let selfPullData = await borrowerDao.getSelfPullData(req.query.borrowerId, req.query.clientId)
    res.status(httpStatus.OK).json(selfPullData)
  } catch (error) {
    res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
    errorLog.error(`Error occured while getting self pull : ${error},`);
  }
}


module.exports.createAlertLog = async function (req, res) {
  try {
    await borrowerDao.createAlertLog(req.body)
    res.status(httpStatus.OK).json({ message: messages.toastr.ALERT_LOGS_UPDATED })
  } catch (error) {
    res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
    errorLog.error(`Error occured while inserting alert logs : ${error},`);
  }
}


module.exports.selfPullBorrower = async function (req, res) {
  try {
    await borrowerDao.selfPullBorrower(req.body)
    res.status(httpStatus.OK).json({ message: messages.toastr.SELF_PULL })
  } catch (error) {
    res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
    errorLog.error(`Error occured while Creating self pull : ${error},`);
  }
}


module.exports.deleteAlert = async function (req, res) {
  let transaction;
  try {
    transaction = await commonDao.getSequelizeTransaction();
    await borrowerDao.deleteAlert(req.body, transaction)
    res.status(httpStatus.OK).json({ message: messages.toastr.ALERT_DELETED })
    await transaction.commit()
  } catch (error) {
    transaction.rollback();
    res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
    errorLog.error(`Error occured while deleting alert : ${error},`);
  }
}


module.exports.getAlerts = async function (req, res) {
  try {
    let alerts = await borrowerDao.getAlerts(req.query);
    alerts = borrowerHelper.groupAlertHistory(alerts);
    res.status(httpStatus.OK).json(alerts)
  } catch (error) {
    res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
    errorLog.error(`Error occured while adding remarks : ${error},`);
  }
}



module.exports.updateSAlertStatusRemark = async function (req, res) {
  try {
    await borrowerDao.updateSAlertStatusRemark(req.body.id, req.body.remarks)
    res.status(httpStatus.OK).json({ message: messages.toastr.REMARKS_UPDATED })
  } catch (error) {
    res.status(httpStatus.SERVERERROR).json({ message: messages.toastr.SERVER_ERROR })
    errorLog.error(`Error occured while updating remarks : ${error},`);
  }
}

module.exports.uploadBorrowerDatabaseFile = async function (req, res) {
  let transaction;
  try {
    /**
     * Initialize a transaction
     */
    transaction = await commonDao.getSequelizeTransaction();

    let clientToken = req.get('clienttoken');
    let clientId = req.query.clientId;

    /**
     * validate if the request is from an isv.
     */
    if (clientToken) {
      /**
       * Check if the client token provided is valid.
       */
      let isvEnrollStatus = await authenticationDao.getIsvEnrollStatus(clientToken);
      if (!isvEnrollStatus) {
        return res.status(httpStatus.UNAUTHORIZED).send({ message: messages.toastr.INVALID_TOKEN });
      }
      clientId = isvEnrollStatus.clientId;
    }

    /**
     * Check if the client is approved so that database can be uploaded.
     */
    let enrollmentStatus = await borrowerDao.clientEnrollmentStatus(clientId);
    if (enrollmentStatus.statusId == constants.status.PENDING) {
      return res.status(httpStatus.OK).send({ message: messages.toastr.CLIENT_NOT_APPROVED });
    }

    /**
     * Validate if file is provided
     */
    if (!req.file) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: messages.toastr.INVALID_DB_FILE })
    }

    /**
     * Upload the database file to s3.
     */
    await upload.uploadDataToS3(req.file.path, 'ClientDataBase/' + clientId + '/' + req.file.originalname);

    /**
     * 
     */
    let lastEntry = await commonDao.getLastEntry(constants.lastEntryType.BORROWER_REFERENCE_NUMBER, clientId);

    /**
     * Convert the xls data to json.
     */
    let borrowers = await borrowerHelper.convertFileContentToJson({
      path: req.file.path,
      clientId: clientId,
      lastCode: lastEntry ? parseInt(lastEntry.value.split('_')[1]) : 0
    });

    /**
     * Update the last entry table.
     */
    await commonDao.updateLastEntry({
      type: constants.lastEntryType.BORROWER_REFERENCE_NUMBER,
      clientId: clientId,
      value: borrowers[borrowers.length - 1].borrowerReferenceNumber,
      isNew: lastEntry ? false : true
    }, transaction)

    /**
     * Save the borrowers to borrower database.
     */
    await borrowerDao.insertBorrowers(borrowers, transaction);

    /**
     * Update borrower count logs
     */
    await borrowerDao.updateBorrowerCountLog({ count: borrowers.length, clientId: clientId }, transaction);

    /**
     * Update the client's status
     */
    await commonDao.updateClientStatus(clientId, constants.status.BORROWER_DB_UPLOAD, transaction)

    let groupedLos = borrowerHelper.groupAllLoEmails(borrowers, clientId);

    await borrowerDao.saveLoUsers(groupedLos, transaction);
    /**
     * If the request was not from an isv client, then send upload success email to client.
     */
    if (!clientToken) {
      // await emailHelper.sendMail({ to: req.email })
    }
    await transaction.commit();

    res.status(httpStatus.OK).json({ message: messages.toastr.UPLOAD_BORROWER_DATABASE })

  } catch (error) {
    transaction.rollback()
    helpHelper.sendUploadBorrowerDatabaseError(req.body, error)
    res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
    errorLog.error(`Error occured while uploading client database : ${error},`);
  }
}

module.exports.getFicoScores = async function (req, res) {
  try {
    let ficoSubscribed = await borrowerDao.checkFicoSubscription(req.query.clientId);

    let ficoScores = [];
    if (ficoSubscribed) {
      ficoScores = await borrowerDao.getFicoScores(ficoSubscribed.subscribedDate, req.query.tuResponseIds)
    }

    res.status(httpStatus.OK).json(ficoScores)
  } catch (error) {
    res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR })
    errorLog.error(`Error occured while fetching fico scores : ${error},`);
  }
}