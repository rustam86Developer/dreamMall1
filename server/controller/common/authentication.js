const bcrypt = require('bcrypt');
const errorLog = require('../../helper/common/logger').errorLog;
const authenticationDao = require('../../dao/common/authentication');
const userDao = require('../../dao/common/usermanagement')
const httpStatus = require('../../helper/utilities/http-status');
const messages = require('../../helper/utilities/messages');
const authenticationHelper = require('../../helper/common/authentication');
const userHelper = require('../../helper/common/usermanagement');
const constants = require('../../helper/utilities/constants');
const crypto = require('crypto');
const moment = require('moment');

/**
 * get email id base on userId
 */

module.exports.getEmailByUserId = async function (req, res) {

    try {
        let email = await authenticationDao.getEmailByUserId(req.params.userId);
        res.status(httpStatus.OK).json(email);

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur While Getting The Email Id Of User  : ${error}`);
    }
}


//generate password & update password in database
module.exports.generatePassword = async function (req, res) {
    try {
        let url = CONFIG.SERVER_BASE_URL + messages.url.LOGIN;

        let generatedPassword = await authenticationHelper.generatePassword();
        let newHashedPassoword = await bcrypt.hashSync(generatedPassword, constants.authentication.SALT_ROUNDS);
        // send email to user
        authenticationHelper.sendGeneratePassword(req.body.email, url, generatedPassword);
        await authenticationDao.updatePassword(req.body.email, newHashedPassoword);
        res.status(httpStatus.OK).json({ message: messages.toastr.EMAIL_SENT });
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur While Generate Password For Client : ${error}`);
    }
}

/**
 * @author Ashish Singh
 * 
 */


module.exports.numberOfUsersByEmail = async function (req, res) {

    try {
       
        let totalUsers = await authenticationDao.numberOfUsersByEmail(req.params.email);
        res.status(httpStatus.OK).json(totalUsers)

    } catch (error) {

        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur Fetching Number Of Users : ${error}`);
    }


}

/**
    * @author Ashish Singh
    * @description This function is common for all type of login `admin`,`client`,`partner` and `admin login as client/partner` 
  */

module.exports.login = async function (req, res) {

  
    try {
        let email;
        let adminLogin = req.body.adminLogin
        adminLogin ? email = req.body.adminEmail : email = req.body.email;
        adminLogin ? systemUserType = constants.systemUserType.ADMIN: systemUserType = req.body.systemUserType

        let authData = await authenticationDao.getAuthData(email,systemUserType);

        if (!authData) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: messages.toastr.EMAIL_DNE });
        }

        /**
         * Compare database password and entered password
         */

        if (!authData.password) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: messages.toastr.PASSWORD_NOT_CREATED })
        }
        let validPass = bcrypt.compareSync(req.body.password, authData.password);

        if (!validPass) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: messages.toastr.INCORRECT_PASSWORD });
        }

        /**
         * Check For Status `Approved/Rejected/Pending` For Company And Partner And `Active/Inactive` For Users. 
         */

        if (!adminLogin) {

            if (authData.clientId) {
                if (authData.systemUserTypeId != constants.systemUserType.ADMIN) {

                    let status = await authenticationDao.checkClientStatus(authData.clientId);

                    if (status.statusId == constants.status.PENDING) {
                        return res.status(httpStatus.UNAUTHORIZED).json({ message: messages.toastr.NOT_APPROVED });
                    }

                    if (status.statusId == constants.status.REJECTED) {
                        return res.status(httpStatus.UNAUTHORIZED).json({ message: messages.toastr.ENROLL_AGAIN });
                    }
                }

            }

            if (authData.partnerId) {

                let status = await authenticationDao.checkPartnerStatus(authData.partnerId);

                if (status.statusId == constants.status.PENDING) {
                    return res.status(httpStatus.UNAUTHORIZED).json({ message: messages.toastr.NOT_APPROVED });
                }

                if (status.statusId == constants.status.REJECTED) {
                    return res.status(httpStatus.UNAUTHORIZED).json({ message: messages.toastr.ENROLL_AGAIN });
                }

            }


        }

        if (authData.statusId != constants.status.ACTIVE) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: messages.toastr.ACCOUNT_NOT_ACTIVE });
        }

        /**
         * Bind data for storing in local storage.
         */

        let userInfo = await authenticationDao.getUserInfo(req.body.email,req.body.systemUserType);  
        let ficoData = await authenticationDao.getFicoData(userInfo.clientId);        
        let loginObj = await authenticationHelper.bindLoginObject(userInfo, ficoData);


        /**
         * Set extra parameter `LoginAsAdmin` when Admin Login As Client/Partner.
         */

        adminLogin ? loginObj.loginAsAdmin = true : false;
        return res.status(httpStatus.OK).json(loginObj)


    } catch (error) {
        console.log(error);
        
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur While Login : ${error}`);

    }
}
/**
   * @author Ashish Singh
   * @description Get UserId By Email -- [Same Route To Be Used In Sending Email For `Forgot Password` And `Complete Registration`]
 */

module.exports.sendPasswordLink = async function (req, res) {

    try {
        let email = req.body.email;
        
        let authData = await authenticationDao.getAuthData(email);

        if (!authData) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: messages.toastr.EMAIL_DNE })
        }

        let token = crypto.randomBytes(16).toString('hex');

        let userTokenObj = {
            userId: authData.id,
            purpose: req.body.purpose,
            token: token,
            expiresAt: moment().utc().add(1, 'days').format()
        }

        let url = CONFIG.SERVER_BASE_URL + messages.url.SET_PASSWORD + token;
        await authenticationDao.saveUserToken(userTokenObj);
        authenticationHelper.sendSetPasswordLink(email, url);
        return res.status(httpStatus.OK).json({ message: messages.toastr.PASSWORD_RESET_LINK })

    } catch (error) {

        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur While Forgot Password : ${error}`);

    }

}

/**
    * @author Ashish Singh
    * @description The function check for valid token and update the password and delete token from user token table.
    * @summary [Same Route To Be Used To Update Password For `Reset Password` And `Complete Registration`]
  */


module.exports.setPassword = async function (req, res) {

    try {
        let validToken = await authenticationDao.checkIfValidToken(req.body.token);


        if (!validToken) {
            return res.status(httpStatus.NOT_FOUND).json({ message: messages.toastr.LINK_EXPIRED })
        }
        let passoword = bcrypt.hashSync(req.body.password, constants.authentication.SALT_ROUNDS);
        await authenticationDao.updatePasswordById(validToken.userId, passoword);
        await authenticationDao.destroyUserToken(req.body.token);
        return res.status(httpStatus.OK).json({ message: messages.toastr.PASSWORD_UPDATED })

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error occur while reset the password : ${error}`);
    }
}

/**
    * @author Ashish Singh
    * @description The function is used to change the password,Old password is compared first and then update the new password.
  */

module.exports.changePassword = async function (req, res) {

    try {
       
        let authData = await authenticationDao.getAuthData(req.body.email,req.body.systemUserType);
        let validPass = bcrypt.compareSync(req.body.oldPassword, authData.password);

        if (!validPass) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: messages.toastr.INCORRECT_OLD_PASSWORD })
        }
        let passoword = bcrypt.hashSync(req.body.newPassword, constants.authentication.SALT_ROUNDS);
        await authenticationDao.updatePasswordById(authData.id, passoword);
        return res.status(httpStatus.OK).json({ message: messages.toastr.PASSWORD_UPDATED })

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur While Changing The Password  : ${error}`);
    }
}

/**
    * @author Ashish Singh
    * @description The function is used to check if the token in url is valid or not.
  */

module.exports.checkIfValidToken = async function (req, res) {

    try {

        let validToken = await authenticationDao.checkIfValidToken(req.params.token);
        if (!validToken) {
            return res.status(httpStatus.NOT_FOUND).json({ message: messages.toastr.LINK_EXPIRED })
        }
        res.status(httpStatus.OK).json({ message: messages.toastr.LINK_VALID });

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur While Checking The Token  : ${error}`);
    }
}

/**
    * @author Ashish Singh
    * @description The function is used to get the client id by user id.
  */

module.exports.getClientByUserId = async function (req, res) {

    try {

        let validToken = await authenticationDao.checkIfValidToken(req.params.token);

        if (!validToken) {
            return res.status(httpStatus.NOT_FOUND).json({ message: messages.toastr.LINK_EXPIRED })
        }
        let client = await authenticationDao.getClientByUserId(validToken.userId);
        res.status(httpStatus.OK).json({ clientId: client.clientId, message: messages.toastr.LINK_VALID });

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur While Getting The Client Id  : ${error}`);
    }
}




/**
    * @author Neha Mangla
    * @description  Get User
    * Resend Password Generation Link
    * Update User Token
  */
module.exports.resendPasswordGenerationLink = async function (req, res) {
    try {
        let userInfo = await userDao.getUser({ userId: req.query.userId, list: false });
        let clientToken = crypto.randomBytes(16).toString('hex');
        userInfo[0].dataValues.token = clientToken
        userHelper.sendEmail(userInfo[0].dataValues, userInfo[0].dataValues.Role.dataValues.name)
        await authenticationDao.updateUserToken({ token: clientToken }, req.query.userId);
        res.status(httpStatus.OK).json({ message: messages.toastr.RESENT_CONFIRMATION_LINK })
    } catch (error) {

        res.status(500).json({ message: messages.toastr.SERVER_ERROR })
        errorLog.error(`Error Occured while generating link for password  : ${error}`);
    }
}



/**
    * @author Ankit Chouhan
    * @description  Get User billing entity 
    * Branch Type Client
    
  */

module.exports.branchClientById = async function (req, res) {
     
    try {
        let email = await authenticationDao.branchClientById(req.params.clientId);
        res.status(httpStatus.OK).json(email);

    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).json({ message: messages.toastr.SERVER_ERROR });
        errorLog.error(`Error Occur While Getting Client Billing Entity  : ${error}`);
    }
}