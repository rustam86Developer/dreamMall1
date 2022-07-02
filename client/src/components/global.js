$(document).on('click', "#logout", function(e) {
    /**
     * Clear the storage
     */
    let loginUrl = localStorage.getItem('loginUrl');
    localStorage.clear();
    /**
     * Redirect to login page
     */
    window.location = loginUrl ? loginUrl : '/login';
});

/**
 * Function To Toggle `Sidebar`
 */

$(document).on('click', "#sidebarCollapse", function(e) {
    // $('#content').removeClass('main-content-width');
    $('#sidebar').toggleClass('active');
    $("#content").toggleClass("main-content-width");
    $("#addClientBtnIcon").toggleClass("table-delete-fixed-header-100");
    $("#deleteButtonDiv").toggleClass("table-delete-fixed-header-100");
    $("#header nav").toggleClass("header-width-full");
});

// $.getCachedScript = function (url) {
// return $.ajax({ url: url, dataType: "script", cache: false })
// };


$.ajaxSetup({
    statusCode: {
        401: function() {
            /**
             * Clear the storage
             */
            localStorage.clear();
            /**
             * Redirect to login page
             */
            window.location = "/login";

        }
    }
});

$.removeOptions = function(el, options) {
    options.forEach(option => {
        $(`${el} option[value=${option}]`).remove();
    });
}

$.removeValue = function(elements) {
    elements.forEach(element => {
        $('#' + element).val(null);
    });
}

$.setLocation = function(pathName) {
    Sammy.apps.body.setLocation(pathName)
}

$.toast = {
    success: function(message) {
        setTimeout(() => {
            toastr.remove();
            toastr.success(message)
        }, 500);
    },
    error: function(message) {
        setTimeout(() => {
            toastr.remove();
            toastr.error(message)
        }, 500);
    },
    warning: function(message) {
        setTimeout(() => {
            toastr.remove();
            toastr.warning(message)
        }, 500);
    },
    info: function(message) {
        setTimeout(() => {
            toastr.remove();
            toastr.info(message)
        }, 500);
    }
}

$.validator.setDefaults({
    errorClass: "invalid-field",
    errorElement: "span",
    highlight: function(el, eClass) { $(el).removeClass(eClass) },
})

$.replaceTemplatePlaceholders = function(options, template) {
    let obj = {
        ...options.broker,
    }
    if (options.borrower) {
        obj.FName = options.borrower.firstName,
            obj.LName = options.borrower.lastName,
            obj.StreetAddress = options.borrower.address,
            obj.City = options.borrower.city,
            obj.State = options.borrower.state,
            obj.ZipCode = options.borrower.zipCode,
            obj.Phone = options.borrower.phoneNumber,
            obj.Email = options.borrower.email,
            obj.TypeOfLoan = options.borrower.typeOfLoan,
            obj.ClosingDate = options.borrower.closingDate ? moment.tz(options.borrower.closingDate, $.CURRENT_TIME_ZONE).format('MM-DD-YYYY') : options.borrower.closingDate,
            obj.DOB = options.borrower.dob ? moment.tz(options.borrower.dob, $.CURRENT_TIME_ZONE).format('MM-DD-YYYY') : options.borrower.dob,
            obj.CalendarLink = options.calendarLink ? options.calendarLink.calenderLink : ''
    }
    // Current date
    obj.CurrentDate = moment().format('MM-DD-YYYY');

    Object.keys(obj).forEach(key => {
        template = template.split('{{' + key + '}}').join(obj[key] ? obj[key].replace(/null|undefined/g, '') : '')
    })
    return template;

}