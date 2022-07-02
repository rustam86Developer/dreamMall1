/**
 * Function to download file from server and cache them in
 * browser
 * @returns {Promise}
 */

$.BASE_URL = window.location.origin;
var HOST = window.location.host;

$.COMMON_BASE_URL = $.CORE_BASE_URL + 'common/'

$.COMMON_PATH = 'src/components/common/';

$.CONNECT_PATH = 'src/components/connect/';

$.S3_BASE_URL = "https://stikkum.s3-us-west-2.amazonaws.com/";

$.PARTNER_PROFILE_IMAGE = $.S3_BASE_URL + 'Partners/Images/ProfilePicture/';
$.PARTNER_LOGO_IMAGE = $.S3_BASE_URL + 'Partners/Images/Logo/';

$.ENROLLMENT_SERVICE_AGREEMENT = $.S3_BASE_URL + 'Clients/ServiceAgreement/enrollmentServiceAgreement.txt';
$.ENROLLMENT_SERVICE_AGREEMENT_PDF = $.S3_BASE_URL + 'Clients/ServiceAgreement/enrollmentServiceAgreement.pdf';
$.ENROLLMENT_RECEIPT = $.S3_BASE_URL + 'Clients/ServiceAgreementReceipt/';
$.VERSE_SERVICE_AGREEMENT = $.S3_BASE_URL + 'Clients/ServiceAgreement/verseServiceAgreement.txt';
$.BROKER_PROFILE_PIC = $.S3_BASE_URL + 'Users/Images/ProfilePicture/'
$.EMAIL_LOGS = $.S3_BASE_URL + 'Logs/Email/';
$.SMS_LOGS = $.S3_BASE_URL + 'Logs/SMS/';
$.TEMPLATES = $.S3_BASE_URL + 'Templates/';
$.COMPLAYTRAQ_DOCUMENT = $.S3_BASE_URL + 'Jobs/ComplyTraq/Receive/';
$.ENROLLMENT_DOCUMENT = $.S3_BASE_URL + 'Clients/EnrollmentDocuments/';
$.HELP_VIDEO = $.S3_BASE_URL + 'Help/Videos/';
$.HELP_DOCUMENT = $.S3_BASE_URL + 'Help/Documents/';
$.SPREADSHEET_URL = $.S3_BASE_URL + 'Public/Template/template.xlsx';
$.REFERRAL_PARTNER_SHEET_URL = $.S3_BASE_URL + 'Public/Template/referral-partner.xlsx';

$.VERSE_LOGIN_URL = "https://app.verse.io/login";

/**Ideal Logout Time */
$.SESSION_TIME = 1800000;

moment.tz.add('Asia/Kolkata|MMT IST +0630|-5l.a -5u -6u|012121|-2zOtl.a 1r2LP.a 1un0 HB0 7zX0|15e6');

$.CURRENT_TIME_ZONE = Intl.DateTimeFormat({ timeZone: 'IST'}).resolvedOptions().timeZone;