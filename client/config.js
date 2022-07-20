/**
 * Function to download file from server and cache them in
 * browser
 * @returns {Promise}
 */

$.BASE_URL = window.location.origin;
var HOST = window.location.host;

// $.CORE_BASE_URL = $.BASE_URL + "/core/";

// $.COMMON_BASE_URL = $.CORE_BASE_URL + 'common/'

$.COMMON_PATH = 'src/components/common/';

$.CONNECT_PATH = 'src/components/connect/';

$.VERSE_LOGIN_URL = "https://app.verse.io/login";

/**Ideal Logout Time */
$.SESSION_TIME = 1800000;

moment.tz.add('Asia/Kolkata|MMT IST +0630|-5l.a -5u -6u|012121|-2zOtl.a 1r2LP.a 1un0 HB0 7zX0|15e6');

$.CURRENT_TIME_ZONE = Intl.DateTimeFormat({ timeZone: 'IST'}).resolvedOptions().timeZone;