$(document).ready(function() {

    var systemUserTypeId = localStorage.getItem('systemUserTypeId')
    var email = localStorage.getItem('email');
    var url = $(location).attr('pathname');
    var clientId = localStorage.getItem('clientId');
    var childLO = localStorage.getItem('childLO');

    $('#currentYear').text(moment().format('YYYY'))
    if(clientId!='null')
    checkIfLOExist();
    $("#backToAdmin").hide();
    $('#LODropdown').hide();

    /**Function to hide Payment Info side when Client login as branch with billing entity same as parent */
    if(clientId!='null')
    $.ajax({
        url: $.COMMON_BASE_URL + "branchClient/" + clientId,
        type: 'GET',
        data: {
            clientId: clientId
        },
        headers: { 'Authorization': $.getJwt() },
        dataType: "JSON",
        success: function(data) {
            if (data) {
                $.BILLING_ENTITY = data.billingEntity
                if (data.billingEntity == billingEntityType.SAME) {
                    $('#sideNavClientPayment').hide();
                }
            }

        },
        error: function(xhr) {
            toastr.remove()
            $.toast.error(xhr.responseJSON.message);
        }
    })

    if (childLO == 'true') {
        $('#sideNavClientPayment').hide();
    }


    $('#partnerResetPassword').hide()
    $('#clientResetPassword').hide()
    $('#profileHover').attr('title', localStorage.getItem('fullName'))

    if (systemUserTypeId == systemUserType.ISA_PARTNER || systemUserTypeId == systemUserType.REFERRAL_PARTNER || systemUserTypeId == systemUserType.ISV_PARTNER) {

        if (localStorage.getItem('profilePicName') == 'null') {
            $('#partnername').append(localStorage.getItem('fullName')[0])
        } else {
            $('#partnername').append(`<img src="${$.PARTNER_PROFILE_IMAGE}${localStorage.getItem('partnerId')}/${localStorage.getItem('profilePicName')}">`)
        }
    } else {
        if (localStorage.getItem('profilePicName') == 'null') {
            $('#clientName').append(localStorage.getItem('fullName')[0])
        } else {
            $('#profileImages').empty().append(`<img src="${$.BROKER_PROFILE_PIC}${localStorage.getItem('userId')}/${localStorage.getItem('profilePicName')}-small">`)
        }
    }

    var redirectUrl;
    if (localStorage.getItem('loginAsAdmin') == 'true' || localStorage.getItem('loginAsAdmin') == true) {

        $("#backToAdmin").show();
        $('#partnerChangePassword').hide();
        $('#partnerResetPassword').show();
        $('#changepassword').hide();
        $('#clientResetPassword').show();
        if (JSON.parse(localStorage.getItem('loginArray')).length == 1) {
            redirectUrl = '/admindashboard';
        } else {
            redirectUrl = '/clientdashboard';
        }

    }

    /**
     * For Login As Client For LO
     */

    if (localStorage.getItem('loginAsClient') == 'true' || localStorage.getItem('loginAsClient') == true) {

        $("#backToAdmin").show();
        $('#changepassword').hide();
        redirectUrl = '/clientdashboard';
    }

    $('#backToAdmin').click(function() {
        var loginArray = JSON.parse(localStorage.getItem('loginArray'));
        let loginJson = loginArray[loginArray.length - 1];

        localStorage.clear();

        for (const [key, value] of Object.entries(loginJson)) {
            localStorage.setItem(key, value);
        }
        window.location = redirectUrl;

    })

    // hide sidenavbar base on partner Type
    if (systemUserTypeId == systemUserType.ISV_PARTNER) { // ISV

        $("#sideNavSwaggerLink").append(` <li class="side-nav-bg abc" id="sideNavSwagger">
        <a target="_blank" href="http://localhost/api/swagger/">API Documentation</a>
    </li>`);
        $('#sidenavPartnerUsermanagement').hide()
    } else if (systemUserTypeId == systemUserType.ISA_PARTNER) { // ISA/ISO
        // $('#sideNavSwagger').hide()
        $("#sideNavGenerateLink").append(`<li class="side-nav-bg" id="sideNavIsaGeneratedLink" >
                <a href="/isageneratedlinks">Generated Links</a>
            </li>`);
    } else { //REFERRAL
        $('#sidenavPartnerUsermanagement').hide()
    }

    if (url == '/help') {
        $("#helpIcon").addClass("color-orange-light")
    }

    //ajax for admin reset the client password
    $('#generatePassword').click(function() {
        $.ajax({
            url: $.COMMON_BASE_URL + "generatePassword",
            type: 'POST',
            data: {
                email: email
            },
            headers: { 'Authorization': $.getJwt() },
            dataType: "JSON",
            success: function(data) {
                toastr.remove()
                $.toast.success(data.message);
                $('.generate-password-modal').modal('toggle');
                $('#passwordViewModal').modal('show');
                $('#generatedPassword').text(data.data)
            },
            error: function(xhr) {
                toastr.remove()
                $.toast.error(xhr.responseJSON.message);
            }
        })
    });



    $('#contactSupportBtn').click(function() {
        $('#contactSupportModal').modal({ backdrop: 'static', keyboard: false })
    })
    $('#supportModalCancelBtn').click(function() {
        document.getElementById('contactSupportIframe').src += '';
        $('#contactSupportModal').modal('hide');
    })

    /**Function for Engage Subscription Display */

    $('#engageBtn').click(function() {
        $.ajax({
            url: $.ENGAGE_BASE_URL + "engage-subscription?clientId=" + clientId,
            type: 'GET',
            headers: { 'Authorization': $.getJwt() },
            dataType: "JSON",
            success: function(data, status) {
                if (data.borrowerDb > 0 || data.referralPartnerDb > 0) {
                    location.href = '/engage';
                } else {
                    location.href = '/engagesubscription';
                }
            },
        })
    })


    function checkIfLOExist() {

        $.ajax({
            url: $.CONNECT_BASE_URL + "LO",
            type: 'GET',
            data: { clientId: clientId },
            headers: { 'Authorization': $.getJwt() },
            success: function(data) {
                if (data.length > 0) {
                    $('#LODropdown').show();
                    $('#sideNavClientLOs').removeAttr('hidden');
                }

            },
            error: function(xhr) {
                toastr.remove()
                $.toast.error(xhr.responseJSON.message);
            }
        })

    }

    /**
     * @Author : Ashish Singh
     * @Description : When click on contact module,Redirect To `Subscription` or `Contact` Module
     */

    $('#contactBtn').click(function() {

        if (localStorage.getItem('contactSub') == 'true') {
            window.location.href = 'contact'
        } else {
            window.location.href = 'contactsubscription'
        }

    })

    //To copy the generated password to clipboard
    $('#copyPassword').click(function() {
        copyToClipboard('#generatedPassword')
        toastr.remove()
        $.toast.success(message.PASSWORD_COPIED);
        $('#passwordViewModal').modal('hide');
    })

    function copyToClipboard(element) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).text()).select();
        document.execCommand("copy");
        $temp.remove();
    }
})