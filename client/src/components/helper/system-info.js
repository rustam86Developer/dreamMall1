$.ACCEPT_LANGUAGE = navigator.language
$.INSTANCE=$.fn.deviceDetector;
$.USER_AGENT = $.INSTANCE.getBrowserName();
$.getJSON("https://jsonip.com?callback=?", function (data) {
    $.IP_ADDRESS = data.ip 
    
});

