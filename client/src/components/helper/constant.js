$.getJwt = function() {
    if (window.localStorage.getItem("jwtToken")) {

        let lastApiTime = moment(localStorage.getItem('lastApiTime')).valueOf();
        let currentApiTime = moment().valueOf();
        console.log("ggggggggggggggggggg", window.localStorage.getItem("jwtToken") );

        // if ((currentApiTime - lastApiTime) < $.SESSION_TIME) {
            localStorage.setItem('lastApiTime', moment().toISOString());
            console.log("ffffffffffffff", window.localStorage.getItem("jwtToken") );

            return JSON.stringify({
                localStorageJWT: window.localStorage.getItem("jwtToken"),
                clientIdLocalStorage: window.localStorage.getItem("clientId"),
                partnerIdLocalStorage: window.localStorage.getItem("partnerId")
            });

        // } else {

        //     localStorage.clear();
        //     /**
        //      * Redirect to login page
        //      */
        //     window.location = "/login";
        // }
    } else {
        console.log("rrrrrrrrrrrrrrr", window.localStorage.getItem("jwtToken") );
        return { localStorageJWT: window.localStorage.getItem("jwtToken") };

    }
}

// $.encrypt = function (params) {

//     let encryptedAES = CryptoJS.AES.encrypt(params, encryptionConstant.TECHNIQUE);
//     let string = encryptedAES.toString().replace(/\+/g, encryptionConstant.PLUS).replace(/\//g, encryptionConstant.SLASH).replace(/\=/g, encryptionConstant.EQUAL_TO);
//     return string;
// }

// $.decrypt = function (params) {

//     let string = params.replace(/xMl3Jk/g, '+').replace(/Por21Ld/g, '/').replace(/Ml32/g, '=');
//     let decodedString = CryptoJS.AES.decrypt(string, encryptionConstant.TECHNIQUE).toString(CryptoJS.enc.Utf8);
//     return decodedString;
// }
const encryptionConstant = {
    PLUS: 'xMl3Jk',
    EQUAL_TO: 'Ml32',
    SLASH: 'Por21Ld',
    TECHNIQUE: 'My Secret Passphrase',

}

const tableHeadingName = {
    SINGLE_EMAIL: 'One-To-One Email',
    REALTIME_CAMPAIGN: 'Realtime Campaign',
    SCHEDULED_CAMPAIGN: 'Scheduled Campaign',
    SCHEDULED_EMAIL: 'Scheduled Email',
    SCHEDULED_SMS: 'Scheduled SMS',
    SCHEDULED_EMAIL_SMS: 'Scheduled Email/SMS',
    SMS: 'SMS',
    CUSTOM_EMAIL: 'Trigger Email',
    CUSTOM_SMS: 'Trigger SMS',
    MASS_SMS: 'Mass SMS',
    SCHEDULED_SMS_CAMPAIGN: 'Scheduled SMS Campaign',
    SEQUENCE_CAMPAIGN: 'Sequence Campaign',
    EVENT_CAMPAIGN: 'Event/Date Campaign',
    AUTO_ALERT_RESPONSE_EMAIL: 'Auto Alert Response Email',
    AUTO_ALERT_RESPONSE_SMS: 'Auto Alert Response SMS',
    AUTO_ALERT_SEQUENCE_CAMPAIGN: 'Auto Alert Sequence Campaign',
    ALL: 'ALL'
}

const pricingHead = {
    STIKKUM: 1,
    PARTNER: 2,
    SPECIAL_LINKS: 3
}

const communicationType = {
    SINGLE_EMAIL: 1,
    CAMPAIGN_EMAIL: 2,
    MASS_EMAIL: 3,
    SMS: 4,
    MASS_SMS: 5,
    CUSTOM_EMAIL: 6,
    CAMPAIGN_SMS: 7,
    AUTO_ALERT_RESPONSE_EMAIL: 8,
    AUTO_ALERT_RESPONSE_SMS: 9,
    CAMPAIGN_SEQUENCE: 10,
    AUTO_ALERT_SEQUENCE: 11,
    CUSTOM_SMS: 12,
    SCHEDULED_EMAIL: 'SCHEDULED_EMAIL',
    ALL: 'ALL'

}

const status = {
    PENDING: 1,
    SITE_INSPECTED: 2,
    ACTIVE: 3,
    IN_PROGRESS: 4,
    STABLE: 5,
    CLOSED_WON: 6,
    CLOSED_LOST: 7,
    APPROVED: 8,
    BORROWER_DB_UPLOAD: 9,
    MONITORED: 10,
    PRODUCTION_LIVE: 11,
    INACTIVE: 12,
    REJECTED: 13,
    SENT: 14,
    RECEIVED: 15,
    SUCCESS: 16,
    TO_DELETE: 19,
    DELETED: 20,
    CLOSED: 21,
    APPROVED_SITE_INSPECTION_PENDING: 22,
    SNOOZE: 23,
    SNOOZED: 24,
    INCORRECT_DATA: 25,
    DUPLICATE_IN_SHEET: 26,
    DUPLICATE_IN_DATABASE: 27,
    CORRECT_DATABASE: 28,
    EMPTY_DATABASE_FILE: 29,
    NOT_APPLICABLE: 30,
    FAILED:17

}

const statusCode = {
    PENDING: 50,
    SITE_INSPECTED: 60,
    APPROVED: 160,
    BORROWER_DB_UPLOAD: 170,
    MONITORED: 180,
    PRODUCTION_LIVE: 190,
    INACTIVE: 200,
    REJECTED: 220,

}

const subscriptionType = {
    ENGAGE: 1,
    FICO: 2,
    CONTACT: 3
}
const systemUserType = {
    ADMIN: 1,
    PARTNER: 2,
    CLIENT: 3,
    ISV_PARTNER: 4,
    ISA_PARTNER: 5,
    REFERRAL_PARTNER: 6,
    USER_MANAGEMENT: 7
}

const accessLogType = {
    ENGAGE: 'Engage',
    REGISTRATION: 'Registration',
    FICO: 'Fico',
    LO_REGISTRATION: 'LO Registration'
}

const subModuleId = {
    SETTING: 21,
    BROKER_PROFILE: 17
}

const helpType = {
    FAQ: 'F',
    VIDEO: 'V',
    DOCUMENT: 'D'
}

const emailType = {
    GENERAL: 'G',
    AUTO_ALERT_RESPONSE_EMAIL: 'A',
    CUSTOM_FIELD: 'C',
    ALL: 'All',
    DOB: 'D',
    CLOSING_DATE: 'C',
}

const paymentType = {
    CARD: 'CARD',
    ACH: 'ACH'
}

const ownerLevel = {
    PRIMARY_USER: 'P',
    SECONDARY_USER: 'S'
}

const isvPaymentMode = {
    SELF: 'S',
    CLIENT: 'C'
}

const templateType = {
    PREFERENCE: 'Preference',
    COMMUNICATION: 'Communication'
}

const emailModule = {
    ADD_CARD: 'adminAddClientCardDetails',
    DELETE_CARD: 'adminDeletedClientCard',
    UPDATE_CARD: 'adminUpdateClientCardInfo'
}

const sqlCondition = {
    ALL: 'ALL',
    STIKKUM_PREFIX: 'STK'
}

const modules = {
    CONNECT: 1,
    ENGAGE: 2,
    CONTACT: 3
}

const partnerType = {
    ISV: 'ISV',
    ISO_ISA: 'ISO/ISA',
    REFERRAL: 'REFERRAL'
}

const referralType = {
    REVENUE_SHARE: 'R',
    UNIT_BONUS: 'U'
}

const roleType = {
    ADMIN: 1,
    PARTNER: 2,
    CLIENT: 3
}

const pricingField = {
    IS_CURRENT: 1
}

const keyword = {
    ADD: 'ADD',
    EDIT: 'EDIT',
    ALL: 'All',
    SELF: 'Self',
    CLIENT: 'Client'
}

const partnerTemplate = {
    ISA_TEMPLATE: '/salesagenttemplate/',
    REFERRAL_TEMPLATE: '/referraltemplate/',
}

const enrollLink = {
    SPECIAL_ENROLL_LINK: '/specialenroll/',
    ISA_ENROLL_LINK: '/salesagent/',
    SAME_BILLING: '/samebilling/',
    DIFFERENT_BILLING: 'differentbilling/'
}

const billingEntityType = {
    SAME: 'S',
    DIFFERENT: 'D'
}

const communicationCategory = {
    EMAIL: 'E',
    SMS: 'S',
    AUTO_SMS: 'AS',
    AUTO_EMAIL: 'AE',
    PARTNERSHIP_STATUS: 'PS',
    AUTO_SEQUENCE: 'ARS',
    CUSTOM_SMS: 'CS',
    CUSTOM_EMAIL: 'CE',
    SIGNATURE: 'SGN',
}

const cronType = {
    RECURRENCE: 'D'
}

const LIMIT = 50;

const SMS_LIMIT = 2000;

const UN_MONITORED_TYPE_LIMIT = 50;

const source = {
    CONNECT: "C",
    ENGAGE: "E"
}


const communicationFor = {
    BORROWER: 'B',
    REFERRAL_PARTNER: 'RP'
}

const borrowerHeaderArray = [
    'firstname',
    'lastname',
    'address',
    'city',
    'state',
    'zipcode',
    'ssn',
    'mobilenumber',
    'phonenumber',
    'email',
    'brokerlofirstname',
    'brokerlolastname',
    'brokeremail',
    'brokermobilenumber',
    'brokerphonenumber',
    'dob',
    'closingdate',
    'typeofloan'
]
const partnerNames = {
    AIME: 'aimeenroll',
    EMC: 'emcenroll',
    STEEPLECHASE: 'lunnen',
    MMLA: 'MMLA' //Michigan Mortgage Lenders Association / MMLA
}
const message = {
    ALL: 'All',
    ADD_USER: 'Add User',
    ADD_ROLE: 'Add Role',
    EDIT_USER: 'Edit User',
    EDIT_ROLE: 'Edit Role',
    ROLE_DETAILS: 'Role Details',
    EXCLUDED_LIST: 'Excluded List',
    SELECTED_LIST: 'Selected List',
    SUBJECT: 'Please enter subject',
    CONTACT_SELECTED: 'Contact Selected',
    DOCUMENT_TITLE: 'Please enter title',
    VIDEO_TITLE: 'Please enter title',
    FAQ_QUESTION: 'Please enter question',
    FAQ_ANSWER: 'Please enter answer',
    ENABLE_AUTO_ALERT_EMAIL: 'Please enable auto alert response email',
    ENABLE_AUTO_ALERT_SMS: 'Please enable auto alert response sms',
    VIDEO_FILE: 'Please select video',
    SELECT_ACTION: 'Please select action',
    SELECT_CONTACT: 'Please select contact',
    CHOOSE_TEMPLATE: 'Please choose template',
    ROLE_TITLE: 'Please enter role title',
    SELECT_MODULES: 'Please select modules',
    SELECT_TIMEZONE: 'Please select timezone',
    SMS_CONTENT: 'Please Write Content For SMS',
    SCHEDULE_DATE: 'Please select schedule date',
    SCHEDULE_TIME: 'Please select schedule time',
    TEMPLATE_TITLE: 'Please enter template title',
    ADDED_FOR: 'Please select at least one option',
    SELECT_ONE_CONTACT: 'Select only one contact',
    RECEIVER_CANNOT_EMPTY: 'Receiver cannot be empty',
    TEMPLATE_CONTENT: 'Please enter template content',
    TEMPLATE_CANNOT_EMPTY: 'Template content cannot be empty',
    EMAIL_ADDRESS_DNE: 'Email address does not exist',
    MOBILE_NUMBER_DNE: 'User mobile number does not exist',
    BORROWER_MOBILE_NUMBER_DNE: 'Borrower mobile number does not exist',
    EDITOR_CANNOT_EMPTY: 'Email editor cannot be empty',
    EMAIL_CONTENT_EMPTY: 'Email content cannot be empty',
    SELECTED_SUB_MODULES: 'Please select sub modules',
    SELECT_CONNECT_MODULE: 'Please select reconnect module',
    EMAIL_SENDING_ERROR: 'Error Occured While Sending Email',
    UPLOAD_TEMP_ERROR: 'Error Occured While Uploading Template',
    SCHEDULED_EMAIL_ERROR: 'Error Occured While Scheduled Email',
    REDUCE_MESSAGE: 'Please reduce message upto 2000 characters',
    CHARACTERS_LESS_THEN_250: 'Characters should be less 250',
    CHARACTERS_LESS_THEN_30: 'Characters should be less then 30',
    ADMIN_TEMPLATE_CANNOT_DELETE: 'Admin template cannot be deleted',
    CANNOT_DELETE_ADMIN_TEMPLATE: 'Admin template cannot be deleted',
    ERROR_WHILE_UPDATE_TEMP: 'Error Occured While updating template',
    ERROR_WHILE_DELETE_TEMP: 'Error Occured While deleting template',
    MOBILE_NUMBER_VALIDATION: "Please enter your 10 digit Mobile no ",
    PHONE_NUMBER_VALIDATION: "Please enter your 10 digit Phone no",
    FAX_NUMBER_VALIDATION: "Please enter your 10 digit Fax no",
    SMS_SENDING_ERROR: 'Error Occured While Sending SMS. Please Try Again!',
    EMAIL_CONTENT_SIZE: 'Email content size should not be greater than 5 MB',
    TEMPLATE_NAME_CANNOT_SAME: 'Template name can not be same as admin template',
    SCHEDULE_EMAIL_DELETING_ERROR: 'Error Occured While Deleting Schedule Email',
    AUTO_ALERT_RESPONSE_EMAIL: 'Please select auto alert response email template',
    AUTO_ALERT_RESPONSE_SMS: 'Please select auto alert response sms template',
    SELECT_OPTION_FROM_DROPDOWN: 'Please select an option from the dropdown only',
    AUTO_ALERT_RESPONSE_EMAIL_ENABLED: 'Send automatic auto alert response email enabled',
    AUTO_ALERT_RESPONSE_EMAIL_DISABLED: 'Send automatic auto alert response email Disabled',
    EMAIL_SCHEDULED_AHEAD_CURRENT_TIME: 'Emails can only be scheduled ahead of current time',
    SMS_SCHEDULED_AHEAD_CURRENT_TIME: 'SMS can only be scheduled ahead of current time',
    EMPTY_NOTES: 'Notes content cannot be empty',
    NOTES_EMPTY: 'Text can not be greater than 1000 characters',
    SELECT_CLIENT_PROFILE_MANDATORY: 'Its mandatory to select client profile if the view is selected in client listing',
    DOCUMENT_TITLE: 'Please enter title',
    VIDEO_TITLE: 'Please enter title',
    FAQ_QUESTION: 'Please enter question',
    FAQ_ANSWER: 'Please enter answer',
    FILE: 'Please select file',
    VIDEO_FILE: 'Please select video',
    ADDED_FOR: 'Please select at least one option',
    FEIN_VALIDATION: "Please enter your 5-16 digit fein ",
    DOMAIN_VALIDATION: "Please enter a valid URL. Protocol is required (http://, https://)",
    DOCUMENT_DOWNLOADED: "Document has been downloaded successfully",
    FILE_LARGE: 'File size must be less than 1 mb',
    FILE_NOT_ACCEPTED: 'File not accepted',
    NUMBER_OF_CARDS: 'Maximum of 3 cards can be saved',
    PRIMARY_CARD: 'Already a primary card',
    ALREADY_PRIMARY: 'Card already set as primary',
    NOT_DELETED_PRIMARY: 'Cannot delete primary card',
    FAILED: 'Failed',
    EMAIL_ALREADY_EXIST: 'Email address already exists',
    EMAIL_REQUIRED: 'Email is required',
    INVALID_EMAIL: 'Email is invalid',
    EMAIL_CAN_NOT_EMPTY: 'Email can not be empty!',
    EMAIL_ADDRESS_CAN_NOT_EMPTY: 'Email address can not be empty',
    PROMOCODE_LINK_COPIED: 'Promocode has been copied successfully',
    SELECT_EXP_DATE: 'Please select an expiry date greater than start date',
    TRANSACTION_VALIDATION: 'Transaction sell rate should be greater than transaction buy rate.',
    IMPLEMENTATION_VALIDATION: "Implementation sell rate should be greater than implementation buy rate.",
    DESCRIPTION_SIZE: "Characters should be less 85",
    CHOOSE_PARTNER: "Please Check Atleast One Checkbox",
    LOGO_SIZE: "File size must be less than 1 mb",
    REMARKS_MISSING: "Please enter remarks",
    ADD_SUBJECT_ERROR: 'Please add subject',
    SELECT_STATE: 'Please select state',
    SELECT_COMPANY: 'Please select partner company',
    VALID_STATE: 'Please enter valid state',
    NO_RESULT_FOUND: 'No results found.',
    ENROLLMENT_COMPLETED: 'Enrollment has been completed',
    SERVICE_AGREEMENT: 'Please agree to the Terms of Service Agreement',
    PERSONAL_MPOC_EMAIL_CAN_NOT_SAME: 'Personal and main point contact email cannot be same',
    FILE_SIZE_TOO_LARGE: 'File size too large',
    FILE_NOT_ACCEPTED: 'File not accepted',
    DRAG_DROP_FILE_HERE: 'Drag and Drop file here OR Click to select file',
    UPLOAD_FILE: 'Upload only jpg & pdf file',
    CAPTCHA: 'Captcha did not match',
    ENTER_QUS: 'Please enter question',
    ENTER_ANS: 'Please enter answer',
    AT_LEAST_ONE_OPTION: 'Please select at least one option',
    VIDEO_SIZE: 'Video size must be less than 50 mb',
    SELECT_ENDUSER: 'Please select an end user',
    SELECT_PARTNER: 'Please select a partner',
    SELECT_BRANCH: 'Please select a branch',
    SELECT_LOAN_ORGINATOR: 'Please select a loan originator',
    NO_CHILD_PRESENT: 'No Current Child Present',
    EMAIL_SUBJECT: 'Email subject can not empty ',
    CANCEL_SCHEDULE_ALERTS: 'Scheduled alerts response cancelled successfully',
    ERROR_CANCEL_SCHEDULE_ALERTS: 'Error occured while canceling scheduled alerts.Please try again.',
    CUSTOM_FIELD: 'Please select custom field template',
    SELECT_CUSTOM_FIELD: 'Please select type of trigger email',
    DENIED_CHILD_SUBSCRIPTION: 'Only Parent account is allowed to subscribe engage',
    ACCEPT_TERMS_CONDITION: 'Please accept the terms and conditions',
    CANNOT_DELETE_BORROWERS: "Cannot delete loan officer's clients",
    PERMISSION_DENIED: "Permission Denied",
    UPDATE_INFO: "Missing Fields,Please update your information",
    CANNOT_UNSUBSCRIBE_CONTACT: 'Currently you cannot unsubscribe for Contact service.',
    LINK_EXPIRED: "Promocode has been Expired",
    LINK_NOT_ACTIVATED: "Promocode is not activated yet",
    ADD_ROLE: "Please add role",
    SUBSCRIBE_CONTACT: "Please subscribe to Contact service",
    AREACODE_MISSING: "Please enter the area code",
    TRANSFER_NUM_MISSING: "Please enter the number for live transfer",
    SMS_TEMPLATE_LENGTH: "you cannot add more than 255 character",
    APIKEY_REQUIRED: "Apikey cannot be empty",
    BOMBBOMB_APIKEY_REQUIRED: "Please provide Apikey from bombbomb to use video services",
    VIDEO_REQUIRED: "Please record a video to save",
    VIDEO_SAVED: "Video Saved Successfully",
    COLUMN_REQUIRED: "Please select all needed data",
    STATUS_CHANGE: 'Client has been deleted, cannot change status.',
    CHOOSE_SEQUENCE: 'Please choose a sequence template to proceed.',
    FILL_NAME: 'Please enter sequence name to proceed.',
    CREATE_STEP: 'Please create atleast one step to proceed.',
    STEP_TEMPLATE: 'Please select template for this step.',
    AFTER_STEP_ERROR: 'Please choose after steps for all the steps except the initial step to proceed.',
    CANNOT_DELETE_ADMIN_SEQUENCE: 'Sequence added by admin cannot be deleted.',
    SET_INTERVAL: 'Please enter either day,hour or minute in interval section.',
    DUPLICATE_STEP: 'This step name already exists.',
    TIME_FRAME_DUPLICATE: 'Please select different date and  timeframe',
    DISABLE_SEQUENCE: 'Sequence cannot be sent for un-monitored.',
    ADMIN_SEQUENCE_NAME: 'Sequence name can not be same as admin sequence,please rename.',
    NO_CONTACT: "Sequence cannot be scheduled, as email and mobile number doesn't exist for this borrower",
    BORROWER_CONTACT_BLANK: 'Borrower(s) does not have mobile number',
    BORROWER_EMAIL_BLANK: 'Borrower(s) does not have email id',
    BORROWER_DOB_BLANK: 'Borrower(s) does not have DOB',
    BORROWER_CLOSING_DATE_BLANK: 'Borrower(s) does not have closing date',
    REFERRAL_PARTNER_CLOSING_DATE_BLANK: 'Un-Monitored does not have closing date',
    REFERRAL_PARTNER_CONTACT_BLANK: 'Un-Monitored does not have mobile number',
    REFERRAL_PARTNER_EMAIL_BLANK: 'Un-Monitored does not have email id',
    REFERRAL_PARTNER_DOB_BLANK: 'Un-Monitored does not have DOB',
    SAVE_STEP: "Please save your step's changes to proceed.",
    SEQUENCE_HOUR_VALIDATION: 'Enter in range of 1 to 23',
    SEQUENCE_MINUTE_VALIDATION: 'Enter in range of 1 to 59',
    INVALID_TIME: "Current step's time cannot be before execute after step's time.",
    NO_DEFAULT_STEP: 'Please create a default step to proceed.',
    INTERVAL_ERROR: 'Please enter interval for all the steps except the initial step to proceed.',
    INCORRECT_DATA: 'These borrower(s) data are incorrect',
    DUPLICATE_IN_SHEET: 'These borrower(s) data are duplicate in sheet',
    DUPLICATE_IN_DATABASE: 'These borrower(s) data are duplicate in system',
    PASSWORD_COPIED: 'Generated password has been copied successfully.',
    PASSWORD_MATCH_ERROR: 'New password and confirm new password do not match.',
    CANNOT_DELETE_ALL_ROWS: "you can't delete all the rows on the table",
    SELECT_TEMPLATE: "Please Select Template",
    BORROWER_DB_UPLOAD: 'Database has been uploaded successfully',
    AUTO_ALERT_NAME_ERROR: 'General And Auto Alert Response Template Name Can Not Be Same',
    BORROWER_DB_UPLOAD: 'Database has been uploaded successfully',
    DATA_UNDER_PROCESS: 'Please correct your data, it is under process.',
    EMPTY_DATABASE_FILE: 'File has no data,Please fill and uplaod again',
    ENABLE_SEND_ALL_SEQUENCE: 'Please select Send All option to proceed.',
    DEFAULT_SEQUENCE: 'Please create a default sequence from templates, to proceed.',
    DEFAULT_TRIGGER_EMAIL: 'Please create a default Trigger Email from templates, to proceed.',
    DEFAULT_TRIGGER_SMS: 'Please create a default Trigger SMS from templates, to proceed.',
    DOB_CLOSINGDATE_SELECT: 'Please select DOB or closing date to proceed.',
    DEFAULT_SEQUENCE: 'Please create a default sequence from templates, to proceed.',
    DEFAULT_TRIGGER_DOB: 'Please select Trigger DOB  template.',
    DEFAULT_TRIGGER_CLOSING: 'Please select Trigger Closing  template.',
    DEFAULT_TRIGGER_SMS: 'Please create a default Trigger SMS from templates, to proceed.',
    DOB_NOT_SELECT: 'Please select DOB checkbox.',
    CLOSING_DATE_NOT_SELECT: 'Please select closing date checkbox',
    CANNOT_SET_SEQUENCE: 'Please disable the Auto Alert Email and Auto Alert SMS to proceed.',
    CANNOT_SET_AUTO_EMAIL_SMS: 'Please disable the Auto Alert Sequence to proceed.',
    GENERAL_TEMPLATE_EXIST: 'General template name already exist',
    AUTO_ALERT_RESP_TEMPLATE_EXIST: 'Auto Alert Response template name already exist',
    DOB_TEMPLATE_EXIST: 'DOB template name already exist',
    CLOSING_DATE_TEMPLATE_EXIST: 'Closing Date template name already exist',
    DOB_CLOSING_SELECT: 'Select DOB or Closing Date checkbox or Both',
    SELECT_TYPE: 'Please select template type',
    DISCARD_SETTING_TRIGGER: 'Email scheduled from settings has been discarded successfully',
    DISCARD_SETTING_TRIGGER_SMS: 'SMS scheduled from settings has been discarded successfully',
    DISCARD_ENGAGE_TRIGGER: 'Email scheduled from engage has been discarded successfully',
    DISCARD_ENGAGE_TRIGGER_SMS: 'SMS scheduled from engage has been discarded successfully',
    BORROWER_REFERRAL_MOBILE_DNE: "Borrower/Un-Monitored does not have mobile no.",
    BORROWER_REFERRAL_EMAIL_DNE: "Borrower/Un-Monitored  does not have email",
    ADMIN_UNMONITORED_TYPE_NOT_DELETE: 'Admin unmonitored type can not be delete',
    ADMIN_UNMONITORED_TYPE_NOT_EDIT: 'Admin unmonitored type can not be edit',
    EXIST_UNMONITORED_ID: 'Un-Monitored type already exists',
    EMPTY_UNMONITORED_TYPE: 'Un-Monitored type content cannot be empty',
    SELECT_UNMONITORED_TYPE: 'Please select Un-Monitored type',
    CHARACTERS_LESS_THEN_50: 'Characters should be less 50',
    ADDRESS_AND_ZIPCODE_REQUIRED: 'First Name, Last Name, Address and zip-code is required to push to reconnect',
    API_TOKEN_EMPTY: 'API token Cannot be empty',
    STOP_CREATE_CONTACT_ATNORTH_TEXT: 'Contacts will no longer be created on NorthText',
    SIGNATURE_NAME: 'Please enter signature name',
    SIGNATURE_CONTENT: 'Please enter signature content',
    PLEASE_WAIT: 'Please wait,Database is being processed',
    PLEASE_SELECT_DATE: 'Please select Date or Time',
    POST_URL_EMPTY: 'Posting URL can not be empty',
    AUTO_SNOOZE_CHECKBOX_CHECK: 'Please select auto snooze checkbox',
    AUTO_SNOOZE_DAYS: 'Please enter auto snooze days',
    SNOOZE_DAYS_GREATER_THEN_ZERO: 'Snooze days should be greater then zero',
    SOURCE_ID_EMPTY: 'SourceId can not be empty',
    MAPPING_ID_EMPTY: 'MappingId can not be empty',
    DISCARD_MESSAGE: 'Database discarded successfully',
    STOP_SEQUENCE: 'Sequence stop successfully',
    PUBLIC_TEMPLATE_CANT_DELETE: 'Public template can not be deleted',
    PUBLIC_SEQUENCE_CANT_DELETE: 'Public sequence can not be deleted',
    ENTER_CUSTOM_FIELD_NAME: 'Please enter custom field name',
    SELECT_CUSTOM_FIELD_TYPE: 'Please select custom field type',
    CUSTOM_FIELD_ADDED: 'Custom field added successfully',
    CUSTOM_FIELD_ADD_IN_EMAIL: 'Custom fields will be added to alert distribution email',
    CUSTOM_FIELD_NOT_ADD_IN_EMAIL: 'Custom fields will not be added to alert distribution email',
    CUSTOM_FIELD_ADD_IN_SMS: 'Custom fields will be added to alert distribution SMS',
    CUSTOM_FIELD_NOT_ADD_IN_SMS: 'Custom fields will not be added to alert distribution SMS',
    CUSTOM_FIELD_EXIST: 'Custom Fields Already Exist',
    ENABLE_ALERT_DISTRIBUTION_SMS: 'Please Enable alert distribution SMS',
    STOP_SEQUENCE_FIRST: 'please stop sequence first',
    CANT_DELETE_SEQUENCE_STEP:'Sequence is in pending state,step cannot be deleted.',
    CANT_ADD_SEQUENCE_STEP:'Sequence is in pending state,step cannot be added.',
    CANT_EDIT_SEQUENCE_STEP:'Sequence is in pending state,step cannot be edit.',
    CANT_EDIT_DELETE_SEQUENCE_STEP:'Sequence is already scheduled, if you want to delete or edit it please delete it from Engage first',
    FILLED_PAUSE_DAYS: 'Please enter pause days',
    EMAIL_TRACKING_FOR_SEQUENCE: 'Please check Email Behavior Monitoring to yes',
    EMAIL_TRACKING_PREFERENCE: 'Preference for Email Behavior Monitoring updated successfully'

}

//Asign current time for versioning.
const updateVersion = $.VERSION_UPDATE;

const smsType = {
    GENERAL: 'G',
    AUTO_ALERT_RESPONSE_EMAIL: 'A',
    ALL: 'All'
}
const communications = {
    EMAIL: 'E',
    SMS: 'S'
}
const campaignTypes = {
    ALL: 'All',
    SEQUENCE: 'SC',
    EVENT: 'EC'
}
const logStatus = {
    SENT: 'Sent',
    IN_PROGRESS: 'In Progress',
    CANCELLED: 'Cancelled',
    PENDING: 'Pending'
}

const customEmailType = {
    DOB: 'D',
    CLOSING_DATE: 'C'
}

const thirdPartyTypes = {
    VERSE: 1,
    BOMBBOMB: 2,
    ZAPIER: 3,
    NORTH_TEXT: 4,
    VELOCIFY: 5,
    LEAD_MAIL_BOX: 6,
    MORTECH: 7,
    LODASOFT: 8

}

const callbackTypes = {
    POST_LEADS: 'PL',
    VIDEO: 'V',
    POST_ALERTS: 'PA',
    NORTH_TEXT: 'NT',
    VELOCIFY: 'VLC',
    LEAD_MAIL_BOX: 'LMB',
    MORTECH: 'MT',
    LODASOFT: 'LDS'
}

const parentType = {
    ROOT_PARENT: 'root_parent',
    BRANCH: 'BRANCH',
    LO: 'LO'
}

const borrowerColumnsArray = [
    'firstName',
    'lastName',
    'address',
    'city',
    'state',
    'zipCode',
    'mobileNumber',
    'phoneNumber',
    'workPhone',
    'email',
    'brokerLoName',
    'brokerLoFirstName',
    'brokerLoLastName',
    'brokerLoEmail',
    'brokerLoMobileNumber',
    'brokerLoPhoneNumber',
    'ficoScore',
    'd2i',
    'incEst',
    'dob',
    'closingDate',
    'typeOfLoan'
]