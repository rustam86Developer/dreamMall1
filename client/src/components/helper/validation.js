$.validator.addMethod("lettersonly", function(value, element) {
    return this.optional(element) || /^[A-Za-z\s]+$/.test(value);
}, "Choose only alphabetic characters");

jQuery.validator.addMethod("letterswithspace", function(value, element) {
    return this.optional(element) || /^[a-z][a-z\s]*$/i.test(value);
}, "Please fillup appropriate input");

//ACCEPT ONLY NUMBER AND CHARACTERS 
jQuery.validator.addMethod("specialChars", function(value, element) {
    return this.optional(element) || /^\w+$/i.test(value);
}, "Please use only alphanumeric or alphabetic characters");

// credit card expiry validation 
$.validator.addMethod("mindate", function(value, element) {
    var curDate = new Date();
    var inputDate = new Date(value.split('|')[1] + '-' + value.split('|')[0]);

    if (inputDate > curDate) {
        return true;
    } else {
        return false;
    }
}, "Invalid Date!");

$.validator.addMethod("noinitSpace", function(value, element) {
    if (value[0] == " ") {
        return false;
    } else {
        return true;
    }
}, "Space not allowed");

// Number not allowed
$.validator.addMethod("notNumber", function(value, element) {
    var reg = /[0-9]/;
    if (reg.test(value)) {
        return false;
    } else {
        return true;
    }
}, "Number not allowed");

// Minimum One Alaphatic Character 
$.validator.addMethod("oneOrMoreChar", function(value, element) {
    return this.optional(element) || /[a-zA-Z]+/.test(value);
}, "Invalid Data");


jQuery.validator.addMethod("alphaNumericLength", function(value) {
    if (value.length > 40) {
        return false
    } else {
        return true
    }
}, "Please enter no more than 40 digits/characters");

//email validation 
$.validator.addMethod("validEmail", function(value, element) {
    var forEmailIdPattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.*?$/i;
    if (forEmailIdPattern.test(value) || value == "") {
        return true;
    } else {
        return false;
    }
}, "Please enter a valid email address.");

//  Masking The Element

if (!$.IS_ISV) {
    $('.phone').mask('0000000000');
}

$('.nmls').mask('000000000000000');
$('.zipCode').mask('000000000');
$('.companyFax').mask('(000) 000-0000');
$('.federalTaxId').mask('000000000000');
$('.area-code').mask('000')
$('.expiryDate').mask('00|0000');
$('#expiryDate').mask('00|0000');
$('#creditCardNumber').mask('0000000000000000000');
$('#accountNumber').mask('000000000000000000');
$('#routingNumber').mask('000000000');
$('#cvv').mask('0000');
$('#fein').mask('00-00000000000000');
$('.ssn').mask('000-00-0000');
$('.date').mask('00/00/0000');
$('.time').mask('00:00:00');
$('.loanOfficers').mask('0000');
$('.loansUnderManagement').mask('00000');
$('#transactionSellRate').mask('00.00');
$('#implementationSellRate').mask('000.00');
$('#transactionRate').mask('00.00');
$('#implementationRate').mask('000.00');
$('#implementationRate').mask('000.00');