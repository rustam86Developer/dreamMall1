clientId = localStorage.getItem('clientId');
var clientInfo = {}
var borrowerOrReferralInfo = {}
canCloseEditor = true;
emailtemplatesForselectedType = [];
var stepIdAndCommunicationContent = {};
var defaultTemplateId;
var selectedBorrowerRpId;
var publicTemplate = false;
var publicTemplateSms = false;
// var Users;

childBranch = JSON.parse(localStorage.getItem('childBranch'));
childLO = JSON.parse(localStorage.getItem('childLO'));

if (!clientId) {
    $('#publicTemplateEmailLabel').hide();
    $('#publicTemplateSmsLabel').hide();
}

$('#generalSms').prop('checked',true);
$('#general').prop('checked',true);
var parentIdWithType;
var numberOfChild;

$('.publicTemplate,.publicTemplateSms,.publicTemplateSequence').hide();
$(`#publicTemplateLabel,#publicSmsTemplateLabel,#publicTemplateSequenceLabel,#publicTemplateForSeqLabel,
#publicTemplateEmailLabel,#publicSequenceEngageLabel,#publicTemplateSmsLabel,#publicEmailTemplateLabel`).hide();
$('#emailTemplateCheckboxes,#smsTemplateCheckboxes').removeClass('justify-content-between');

// ======================to get number of child start================
function getNumberOfChild() {
    $.ajax({
        url: `${$.CONNECT_BASE_URL}getNumberOfChilds`,
        headers: { 'Authorization': $.getJwt() },
        type: 'GET',
        data: { clientId: clientId },
        async: false,
        datatype: 'json',
        success: function(data) {
            numberOfChild = data.getNumberOfChilds;
            if (numberOfChild) {
                $('.publicTemplate,.publicTemplateSms,.publicTemplateSequence').removeClass('d-none').show();
                $(`#publicTemplateLabel,#publicSmsTemplateLabel,#publicTemplateSequenceLabel,#publicTemplateForSeqLabel,#publicTemplateEmailLabel,#publicSequenceEngageLabel,#publicTemplateSmsLabel,#publicTemplateSmsLabel,#publicEmailTemplateLabel`).show();
                $('#emailTemplateCheckboxes,#smsTemplateCheckboxes').addClass('justify-content-between');
            }
        }
    });
}
if (clientId) {
    getNumberOfChild();
}

// ======================to get number of child end================

$('#borrowersTable').on('click', 'a.activityLog', function() {
    selectedBorrowerRpId = $(this).attr('value');
});

$('#generalTemplate').prop('checked', true).trigger('change');
/**
 * Renders the default template on html based on type specified
 */
//Please select template from settings
$('#selectedEmailTemplateName').html('Please select template from settings');
async function renderDefaultTemplate(templateType, templateCommunicationType) {
    try {
        let template = await $.ajax({
            url: `${$.COMMON_BASE_URL}/template/default`,
            type: 'GET',
            async: false,
            data: { clientId: clientId, type: templateType, communicationType: templateCommunicationType },
            headers: { 'Authorization': $.getJwt() }
        })
        if (template.length) {

            //Checking condition for Email 
            if (templateCommunicationType == communicationCategory.EMAIL) {
                templateContent = await $.get($.TEMPLATES + template[0].Template.fileName);
                let calendarLink;
                if (borrowerOrReferralInfo.brokerLoFirstName) {
                    calendarLink = await getCalendarLinkByLOName(borrowerOrReferralInfo);
                }
                templateContent = $.replaceTemplatePlaceholders({ broker: clientInfo, borrower: borrowerOrReferralInfo, calendarLink: calendarLink }, templateContent);
                if (template[0].Template.type == "A") {
                    defaultTemplateId = template[0].templateId;
                    $('#autoAlert').prop('checked', true)
                } else {
                    defaultTemplateId = template[0].templateId;
                    $('#general').prop('checked', true)
                }
                $('#emailSubject').val(template[0].Template.subject ? template[0].Template.subject : '')

                $(".Editor-editor").html(templateContent)
                if (template[0].Template.name) {
                    $('#selectedEmailTemplateName').html('Default - ' + template[0].Template.name)
                }

            } else if (templateCommunicationType == communicationCategory.SIGNATURE) {
                $('#allSignatureCheckbox > option').each(function() {
                    if (template[0].templateId == $(this).val()) {
                        $.DEFAULT_SIGNATURE = template[0].templateId;
                        $(this).prop('selected', true);
                        $('#applySignature').trigger('click');
                    }
                });
            } else {
                templateContent = template[0].Template.body;
                if (template[0].Template.type == "A") {
                    $('#autoAlertSms').prop('checked', true)
                } else {
                    $('#generalSms').prop('checked', true)
                }
                if (template[0].Template.name) {
                    $('#selectedSmsTemplateName').html('Default - ' + template[0].Template.name)
                }
                $("#smsContent").val(templateContent)
            }

        } else {
            if (templateCommunicationType != communicationCategory.SIGNATURE) {
                $(".Editor-editor").empty()
                $("#smsContent").val('')
            }
        }
    } catch (error) {
        console.log(error)
        toastr.remove()
        $.toast.error(error.responseJSON.message)
    }
}

/**
 * Lists all the templates of a particular client
 * for selecting to use for email
 */
$('#chooseEmailTemplateButton').click(() => {
    $("#chooseConnectTemplateSms").hide()
    $('#cancelViewBtn').hide();
    $("#smsTemplateSection").hide()
    $('#smsTemplatesRenderSection').empty();
    $("#chooseConnectTemplateEmail").show()
    $('#selectTemplateHeader').html('Select Template')
    $('#emailTemplateTypeDiv,#chooseCancelBtn').show();
    $('#closeViewTempBtn').hide();
    $('#publicTemplateEmail').prop('checked', false);
    $('#templateSelectionModal').modal('show');
    getAllClientTemplates($('input[name=defaultTemplateType]:checked').val());
    // renderTemplateList();
})

$('#publicTemplateEmail').click(() => {
    getAllClientTemplates($('input[name=templateSelectionType]:checked').val());
});

async function getAllClientTemplates(templateSelectionType) {
    emailtemplatesForselectedType = "";
    publicTemplate = $('#publicTemplateEmail').prop('checked') ? true : false;
    let templateResponse = await $.ajax({
        url: $.COMMON_BASE_URL + "templates?clientId=" + clientId + "&type=" + templateSelectionType + "&statusId=" + status.ACTIVE + "&communicationType=" + communicationCategory.EMAIL + "&publicTemplate=" + publicTemplate,
        type: 'GET',
        // data: { clientId: clientId, type: templateSelectionType },
        headers: { "Authorization": $.getJwt() }
    })
    // $('input[name=templateSelectionType]:checked').val(templateSelectionType);
    templates = templateResponse.templatesData;
    Users = templateResponse.Users;
    parentIdWithType = templateResponse.parentIdWithType;
    emailtemplatesForselectedType = templates && templates.length > 0 ? templates : [];
    parentIdWithType = templateResponse.parentIdWithType;
    renderTemplateList();
    if (publicTemplate) {
        $(document).find('#standardTemplate').hide();
        $(document).find('#standardTemplate').prev().hide();
    } else {
        $(document).find('#standardTemplate').show();
        $(document).find('#standardTemplate').prev().show();
    }
}

/**
 * Renders the template list html
 */
function renderTemplateList() {
    templates = emailtemplatesForselectedType;
    $('#clientTemplates').html('')
    $('#smsTemplateSection').hide();
    $('#emailTemplateSection').show();
    $('#clientTemplates').empty();
    //==================to set custom and standard temp= start=================================
    if ($('#generalTemplate').prop('checked'))
        $('#clientTemplates').html(`
    <div class="col-12 mb-3">
            <div class="col-12 p-0" id="customTemplateHeading">
                <label class="details-text color-grey">Custom</label>
            </div>

        <div class="row" id="customTemplate">
        </div>
    </div>
    <div class="col-12">
            <div class="col-12 p-0" id="standardTemplateHeading">
                <label class="details-text color-grey">Standard</label>
            </div>
        <div class="row" id="standardTemplate">
        </div>
    </div>`);

    // ============================to show all parent that create tamplate=start========================
    // $('#publicTemplate').empty();
    // for(let i=0; i < Users.length; i++){
    //     $('#publicTemplate').append(`
    //         <div class="col-12">
    //             <label class="details-text color-grey">${Users[i].firstName+' '+ Users[i].lastName}</label>
    //             <div class="row" parentId="${Users[i].clientId}" id="parentId${Users[i].clientId}"></div>
    //         </div>
    //     `);
    // }
    // ============================to show all parent that create tamplate=End========================

    // =================to set custom and standard temp= end==================================
    var customTemplateEmpty = true,
        standardTemplateEmpty = true,
        publicTemplateEmpty = true;
    if (templates.length > 0) {
        for (let i = 0; i < templates.length; i++) {
            const template = templates[i];
            //========to Appned template in General or Auto alert Response Template=end============
            if ($('#generalTemplate').prop('checked')) {
                // =========================append Templte in standard and custom section=end==========
                if (template.clientId == null) {
                    $('#standardTemplate')
                        .append(`
                    <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
                        <div class="template-card-grey rounded p-2 px-2 d-flex justify-content-between align-items-center">
                            <label class="custom-checkbox mb-0 font-14 template-title" data-placement="top" title="${template.name}"> <input type="radio" isDefault="${template.isDefaultTemplate}" tempType ="${template.type}" tempId="${template.id}" name="templateConnectEmail" templateName="${template.name}" subject="${template.subject}" value='${template.fileName}'> <span class="checkmark"></span>${template.name}</label>
                        <div class="d-flex align-items-center">
                        <span class="view-icon cursor-pointer font-13" tempId="${template.id}" templateName="${template.name}" value="${template.fileName}" subject="${template.subject}" tempType="${template.type}" communicationType="${template.communicationType}"><i class="far fa-eye color-orange-light"></i></span>
                        </div>
                        </div>
                    </div>`)
                    standardTemplateEmpty = false;
                } else if (template.clientId) { //==clientId
                    $('#customTemplate')
                        .append(`
                    <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
                        <div class="template-card-grey rounded p-2 px-2 d-flex justify-content-between align-items-center overflow-hidden">
                            <label class="custom-checkbox mb-0 font-14 template-title" data-placement="top" title="${template.name}"> <input type="radio" isDefault="${template.isDefaultTemplate}" tempType ="${template.type}" tempId="${template.id}" name="templateConnectEmail" templateName="${template.name}" subject="${template.subject}" value='${template.fileName}'> <span class="checkmark"></span>${template.name}</label>
                        <div class="d-flex align-items-center">
                        <span class="view-icon cursor-pointer font-13" tempId="${template.id}" templateName="${template.name}" value="${template.fileName}" subject="${template.subject}" tempType="${template.type}" communicationType="${template.communicationType}"><i class="far fa-eye color-orange-light"></i></span>
                        ${template.isPublic ? `<div class="public-label clientId${template.clientId}" title="${localStorage.getItem("fullName")}'s Template"><div class="public-text">P</div></div>`:  '' }
                        </div>
                        </div>
                    </div>`)
                    customTemplateEmpty = false;
                }
                
                // =========================append Templte in standard and custom section=end==========
            } else  { 
                $('#clientTemplates')
                    .append(`
                <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
                    <div class="template-card-grey rounded p-2 px-2 d-flex justify-content-between align-items-center overflow-hidden">
                        <label class="custom-checkbox mb-0 font-14 template-title" data-placement="top" title="${template.name}"> <input type="radio" isDefault="${template.isDefaultTemplate}" tempType ="${template.type}" tempId="${template.id}" name="templateConnectEmail" templateName="${template.name}" subject="${template.subject}" value='${template.fileName}'> <span class="checkmark"></span>${template.name}</label>
                    <div class="d-flex align-items-center">
                    <span class="view-icon cursor-pointer font-13" tempId="${template.id}" templateName="${template.name}" value="${template.fileName}" subject="${template.subject}" tempType="${template.type}"  communicationType="${template.communicationType}"><i class="far fa-eye color-orange-light"></i></span>
                    ${template.isPublic ? `<div class="public-label clientId${template.clientId}" title="${localStorage.getItem("fullName")}'s Template"><div class="public-text">P</div></div>`:  '' }
                    </div>
                    </div>
                </div>`)
            }
            //========to Appned template in General or Auto alert Response Template=end============
        }
        $('#clientTemplates span.view-icon').click(displayEmailTemplateDetails)
        $('input[name=templateSms').each(function() {
            if ($(this).attr('isDefault') == 'true') {
                $(this).attr('checked', true);
            }
        })
    } else {
        $('#clientTemplates').html(`<div class='col-12'>
        <div class="border no-data-div"">
                <p class="details-text-label mb-0">No templates found</p>
                </div>
                </div> 
            `)
    }
    customTemplateEmpty ? $('#clientTemplates #customTemplate').append(`<div class='col-12'>
    <div class="border no-data-div"">
            <p class="details-text-label mb-0">No templates found</p>
            </div>
            </div> 
    `) : '';
    standardTemplateEmpty ? $('#clientTemplates #standardTemplate').append(`<div class='col-12'>
    <div class="border no-data-div"">
            <p class="details-text-label mb-0">No templates found</p>
            </div>
            </div> 
    `) : '';

    if(Users)
    for(let i=0; i < Users.length; i++){
        $(document).find(`.clientId${Users[i].clientId}`).attr('title', `${Users[i].firstName + ' ' + Users[i].lastName}'s Template`);
        if((parentIdWithType[Users[i].clientId]==parentType.ROOT_PARENT || parentIdWithType[Users[i].clientId]==parentType.LO) && Users[i].clientId!=clientId){
            $(document).find(`.clientId${Users[i].clientId}`).addClass('public-label-grey');
        }
        else if(parentIdWithType[Users[i].clientId]==parentType.BRANCH && Users[i].clientId!=clientId){
            $(document).find(`.clientId${Users[i].clientId}`).addClass('public-label-blue');
        }
    }
}

$('#closeViewTempBtn').hide();

async function displayEmailTemplateDetails() {
    let mainDiv = $('#clientTemplates');   
    $('#selectTemplateHeader').empty();
    mainDiv.empty();
    $('#chooseConnectTemplateEmail').hide();
    $('#chooseCancelBtn').hide();
    $('#emailTemplateTypeDiv').hide();
    $('#clientTemplates').prev().removeClass('d-flex');
    $('#clientTemplates').prev().hide();
    $('#cancelViewBtn').show();
    let tc = await $.get($.TEMPLATES + $(this).attr('value'));

    let subject = null;
    if ($(this).attr('tempType') == emailType.AUTO_ALERT_RESPONSE_EMAIL || $(this).attr('tempType') == emailType.GENERAL) {
        let sub = $(this).attr('subject');
        subject = sub && sub != '' ? sub : null;
    }
    let calendarLink;
    if (borrowerOrReferralInfo.brokerLoFirstName) {
        calendarLink = await getCalendarLinkByLOName(borrowerOrReferralInfo);
    }
    tc = $.replaceTemplatePlaceholders({ broker: clientInfo, borrower: borrowerOrReferralInfo, calendarLink: calendarLink }, tc);
    let tn = $(this).attr('templateName');
    $('#selectTemplateHeader').html(tn);
    let text = `<div class="col-12">`;
    if (subject) {
        text += `<div class="border-bottom-grey d-flex align-items-center d-wrap mb-3 width-100-lg">
            <p class="content-text mb-1 mr-2 word-break">Subject: <b class="color-blue ml-1" >${subject}</b></p>
        </div>`;
    }
    if ($(this).attr('communicationType') == communicationCategory.EMAIL) {
        let fileName = $(this).attr('value');
        let templateId = $(this).attr('tempId')
        $('#templateBody').areaLoader(true);
        jQuery.get($.TEMPLATES + fileName, function(data) {
            $('#templateBody').areaLoader(false);
            // data = $.replaceTemplatePlaceholders({ broker: clientInfo, borrower: borrowerOrReferralInfo, calendarLink: calendarLink }, data);
            text += data + `</div>`;
            mainDiv.html(text);
            let alreadySelected = false;
            Object.keys(templSignRelation).forEach(key => {
                if (Number(key) == Number(templateId)) {
                    $('#allSignatureCheckbox > option').each(function() {
                        if (templSignRelation[key] == Number($(this).val())) {
                            alreadySelected = true;
                            $(this).prop('selected', true);
                            $('#applySignature').trigger('click');
                        }
                    });
                }
            });
            if (!alreadySelected) {
                $('#allSignatureCheckbox > option').each(function() {
                    if (Number($(this).val()) === $.DEFAULT_SIGNATURE) {
                        $(this).prop('selected', true);
                        $('#applySignature').trigger('click');
                    }
                })
            }
        });
    } else {
        text += `<div>${tcCnvt}</div></div>`;
        mainDiv.html(text);
    }
    $('#closeViewTempBtn').show();

}

$(document).on('click', "#closeViewTempBtn,#templateSelectionModal .close", function() {
    $('#clientTemplates').prev().addClass('d-flex');
    $('#clientTemplates').prev().show();  
    renderTemplateList();
    $('#closeViewTempBtn').hide();  
    $('#emailTemplateTypeDiv').show();
    $('#chooseCancelBtn').show();
    $('#chooseConnectTemplateEmail').show();
    $('#selectTemplateHeader').empty();
    $('#selectTemplateHeader').html('Select Template');  
})

/**
 * Renders the selected template in the editor
 */
//  let templSignRelation = {};
async function renderSelectedTemplate() {

    if (!$('input[name=templateConnectEmail]:checked').val()) {
        toastr.remove()
        toastr.error(message.CHOOSE_TEMPLATE);
        return
    }

    templateContent = await $.get($.TEMPLATES + $('input[name=templateConnectEmail]:checked').val());
    var subject = $("input[name='templateConnectEmail']:checked").attr("subject");
    let templateId = $("input[name='templateConnectEmail']:checked").attr('tempId')
    var tempName = $("input[name='templateConnectEmail']:checked").attr("templateName");

    if (subject) {
        $('#emailSubject').val(subject);
    }
    if (tempName) {
        $('#selectedEmailTemplateName').html(tempName);
    }
    let calendarLink;
    if (borrowerOrReferralInfo.brokerLoFirstName) {
        calendarLink = await getCalendarLinkByLOName(borrowerOrReferralInfo);
    }
    templateContent = $.replaceTemplatePlaceholders({ broker: clientInfo, borrower: borrowerOrReferralInfo, calendarLink: calendarLink }, templateContent);
    // templateContent = replacePlaceHolders(templateContent)

    $(".Editor-editor").html(templateContent);
    await renderDefaultTemplate(emailType.GENERAL, communicationCategory.SIGNATURE);
    Object.keys(templSignRelation).forEach(key => {
        if (Number(key) == Number(templateId)) {
            $('#allSignatureCheckbox > option').each(function() {
                if (templSignRelation[key] == $(this).val()) {
                    alreadySelected = true;
                    $(this).prop('selected', true);
                }
            });
        }
    });

    $('#applySignature').trigger('click');
    $("#templateSelectionModal").hide();
    let selectedTemplateType = $("input[name='templateConnectEmail']:checked").attr("tempType");
    if (selectedTemplateType == 'A') {
        $('#autoAlert').prop('checked', true);
    } else {
        $('#general').prop('checked', true);
    }
    $('#templateSelectionModal').modal('hide')

}
/**
 * This function retrieves the client information
 * required for setting in templates placeholders
 */
async function getClientInformation() {
    try {
        clientInfo = await $.ajax({
            url: `${$.CONNECT_BASE_URL}/client-info-for-template`,
            type: 'GET',
            data: { clientId: clientId },
            headers: { "Authorization": $.getJwt() }
        })
        } catch (error) {
        toastr.remove()
        $.toast.error(error.responseJSON.message)
    }
}

async function renderDefaultSignature(defaultTemplateId) {
    let alreadySelected = false;
    Object.keys(templSignRelation).forEach(key => {
        if (Number(key) == Number(defaultTemplateId)) {
            $('#allSignatureCheckbox > option').each(function() {
                if (templSignRelation[key] == $(this).val()) {
                    alreadySelected = true;
                    $(this).prop('selected', true);
                    $('#applySignature').trigger('click');
                }
            });
        }
    });
    if (!alreadySelected) {
        await renderDefaultTemplate(emailType.GENERAL, communicationCategory.SIGNATURE);
    }
}

$.communicate = async function() {

        let tableName;
        if (clientType == communicationFor.BORROWER) {
            tableName = 'borrowersTable';
        } else if (clientType == communicationFor.REFERRAL_PARTNER) {
            tableName = 'referralPartnerTable';
        }
        let row = $('#' + tableName).DataTable().row($(this).parents('tr')).data();
        borrowerOrReferralInfo = row;
        $('#recepientName').text(row.lastName ? row.firstName + ' ' + row.lastName : row.firstName);
        $('#smsRecepientName').text(row.lastName ? row.firstName + ' ' + row.lastName : row.firstName);
        $('#smsRecepientMobile').text(row.mobileNumber ? row.mobileNumber : row.phoneNumber ? row.phoneNumber : null);
        $('#recepientEmail').text(row.email);
        $("#placeholderDropown").hide();
        /**
         * Fetch the information about the client if 
         * it's not already fetched.
         */
        if (!clientInfo.legalName) getClientInformation();
        /**
         * Render the default template
         */
        await renderDefaultTemplate(emailType.GENERAL, communicationCategory.EMAIL);

        await renderDefaultSignature(defaultTemplateId);

        // renderDefaultTemplate(emailType.GENERAL, communicationCategory.SIGNATURE);
        getAllClientTemplates(emailType.GENERAL);


    }
    /**
     * Function to get calender link by client id.
     */
async function getCalendarLinkByLOName(borrowerData) {
    let calendarLink = await $.ajax({
        url: `${$.COMMON_BASE_URL}/calendar-link`,
        type: 'GET',
        data: { brokerLoFirstName: borrowerData.brokerLoFirstName, brokerLoLastName: borrowerData.brokerLoLastName ? borrowerData.brokerLoLastName : null },
        headers: { 'Authorization': $.getJwt() }
    })
    return calendarLink;
}
/**
 * Sends the email by collecting the data from the fields
 * running all the necessary validations
 */
$('#emailTrackingSequenceNo').prop('checked',true)
$("#emailTrackingSequence").change(function(){
    if(!$('#emailTrackingSequenceYes').prop('checked')){
        $('#emailTrackingSequence').val('');
        toastr.remove();
        toastr.error(message.EMAIL_TRACKING_FOR_SEQUENCE);
    }
})
$("[name=emailTrackingSequence]").change(function(){
    if(!$('#emailTrackingSequenceYes').prop('checked')){
        $('#emailTrackingSequence').val('');
    }else{
        $('#emailTrackingSequence').val('1');
    }
})
async function sendEmail() {
    try {
        let body = $("#txtEditor").Editor("getText").trim();
        let subject = $('#emailSubject').val().trim();
        let emailTrackingSequence = $('#emailTrackingSequence').val();
        if(!$('#emailTrackingSequenceYes').prop('checked')){
            emailTrackingSequence = '';
        }
        let to = borrowerOrReferralInfo.email ? borrowerOrReferralInfo.email : $('#recepientEmail').text();
        let from = localStorage.getItem('email');
        if(!borrowerOrReferralInfo.email){
            clientType = communicationFor.BORROWER;
        }
        /**
         * Validations
         */
        if (!body && !body.match(/<img/)) return $.toast.error(message.EMAIL_CONTENT_EMPTY);
        if (!subject) return $.toast.error(message.EMAIL_SUBJECT);
        if (body.length > 5242880) return $.toast.error(message.EMAIL_CONTENT_SIZE);
        if (subject.length > 250) return $.toast.error(message.CHARACTERS_LESS_THEN_250);
        if (!to) return $.toast.error(message.EMAIL_ADDRESS_CAN_NOT_EMPTY);
        if (!$(`<custom>${body}</custom>`).text().trim() && !body.match(/<img/)) return $.toast.error(message.EMAIL_CONTENT_EMPTY);
        let calendarLink;
        if (borrowerOrReferralInfo.brokerLoFirstName) {
            calendarLink = await getCalendarLinkByLOName(borrowerOrReferralInfo);
        }
        body = $.replaceTemplatePlaceholders({ broker: clientInfo, borrower: borrowerOrReferralInfo, calendarLink: calendarLink }, body);
        let logsObj = {
            clientId: clientId,
            communicationTypeId: communicationType.SINGLE_EMAIL,
            communicationTime: new Date(),
            communicationFor: clientType,
            subject: subject,
            emailTrackingSequence: emailTrackingSequence
        }

        if (borrowerOrReferralInfo.type) {
            logsObj.unmonitoredType = borrowerOrReferralInfo.type;
        }

        $('#sendEmail').showMiniLoader('Sending');
        if (clientType == communicationFor.BORROWER) {
            logsObj.borrowerDatabaseIds = borrowerOrReferralInfo.id ? borrowerOrReferralInfo.id : id;

        } else if (clientType == communicationFor.REFERRAL_PARTNER) {
            logsObj.referralPartnerIds = borrowerOrReferralInfo.id;
        }
        let response = await $.ajax({
            url: `${$.ENGAGE_BASE_URL}email`,
            type: 'POST',
            headers: { "Authorization": $.getJwt() },
            data: {
                emailBody: body,
                emailId: to,
                brokerEmail: from,
                logsObj: logsObj
            }
        })
        $('#sendEmail').hideMiniLoader('Send')
        canCloseEditor = true;
        clearFields()
        $('#communicationModal').modal('hide')
          canCloseEditor = false;

        toastr.remove();

        if (response.status == false) {
            $.toast.error(response.message);
        } else {
            $.toast.success(response.message);
        }

    } catch (error) {
        console.log(error);
        $('#sendEmail').hideMiniLoader('Send')
        toastr.remove()
        $.toast.error(error.responseJSON.message)
    }
}

/**
 * Send sms to borrower based on mobile number provided
 */
async function sendSms() {
    try {
        let smsContent = $('#smsContent').val().trim();
        let mobileNumber = borrowerOrReferralInfo.mobileNumber ? borrowerOrReferralInfo.mobileNumber : borrowerOrReferralInfo.phoneNumber ? borrowerOrReferralInfo.phoneNumber : null;
        if(!mobileNumber){
            mobileNumber = $('#smsRecepientMobile').text() ? $('#smsRecepientMobile').text() : null;
            clientType = communicationFor.BORROWER;
            // borrowerOrReferralInfo.id = id;
        }
        /**
         * Validations
         */
        if (!smsContent) return $.toast.error(message.SMS_CONTENT);
        if (!mobileNumber) return $.toast.error(message.PHONE_NUMBER_VALIDATION);
        if (smsContent.length > SMS_LIMIT) {
            toastr.remove();
            $.toast.error(message.REDUCE_MESSAGE);
            return;
        }
        let calendarLink;
        if (borrowerOrReferralInfo.brokerLoFirstName) {
            calendarLink = await getCalendarLinkByLOName(borrowerOrReferralInfo);
        }
        // smsContent = $.replaceTemplatePlaceholders({ broker: clientInfo, borrower: borrowerOrReferralInfo, calendarLink: calendarLink }, smsContent);

        $('#sendSmsBtn').showMiniLoader('Sending')
        let response = await $.ajax({
            url: `${$.ENGAGE_BASE_URL}mass-sms`,
            type: 'POST',
            headers: { "Authorization": $.getJwt() },
            data: {
                data: [borrowerOrReferralInfo.id],
                logsObj: {
                    clientId: clientId,
                    mobileNumber: mobileNumber,
                    communicationFor: clientType,
                    communicationTypeId: communicationType.SMS,
                    communicationTime: new Date(),
                    communicationContent: smsContent,
                    statusId: status.PENDING,
                    source: source.CONNECT,
                    unmonitoredType: borrowerOrReferralInfo ? borrowerOrReferralInfo.type : null
                }
            }
        })
        $('#sendSmsBtn').hideMiniLoader('Send')
        canCloseEditor = true;
        clearFields()
        $('#communicationModal').modal('hide')
        canCloseEditor = false;

        toastr.remove()
        if (response.status == false) {
            $.toast.error(response.message);
        } else {
            $.toast.success(response.message);
        }

    } catch (error) {
        console.log(error);
        $('#sendSmsBtn').hideMiniLoader('Send')
        toastr.remove()
        $.toast.error(error.responseJSON.message)
    }
}

function clearFields() {

    $('#generalTemplate').prop('checked', true);
    $('#generalSmsTemplate').prop('checked', true);
    $('#discardConfirmationModal').modal('hide');
    templateContent = '';
    $('#selectedEmailTemplateName').text('Please select template from settings');
    $('#selectedSmsTemplateName').text('Please select template from settings');
    $('#emailSubject').val('');
    $('#smsContent').val('')
    $(".Editor-editor").empty();
    // $("#general").prop("checked", false);
    // $("#autoAlert").prop("checked", false)
    // $('#generalSms').prop('checked', false);
    // $('#autoAlertSms').prop('checked', false);
    $("#generalTemplate").trigger('click');
    $('#applySignature').addClass('disabled-link');
    $('#allSignatureCheckbox').prop('selectedIndex', 0);
    getAllClientTemplates(emailType.GENERAL)
}

$(document).ready(function() {

    // let communicationLogTable = null;
    let logsType = communicationType.ALL;
    // let clientInfo = {}
    // let borrowerOrReferralInfo = {}
    let templateType = emailType.GENERAL;
    let templateSelectionType = emailType.GENERAL;
    $("#txtEditor").Editor();

    $(".viewby li a").click(function() {
        $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <i class="fas fa-chevron-down font-10"></i>');
        $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
    });

    $('#firstRow').text('S.No.')
    $('#secondRow').text('Activity')
    $('#thirdRow').text('Subject')
    $('#fourthRow').text('Date')
    $('#fifthRow').text('Cancelled On')
    $('#sixthRow').text('View')

    $('#firstSequenceRow').text('S.No.')
    $('#secondSequenceRow').text('Sequence type')
    $('#thirdSequenceRow').text('Name')
    $('#fourthSequenceRow').text('Date')
    $('#sixthSequenceRow').text('Action')

    $.communicationLogTable = $('#communicationLogTable').DataTable({
        paging: true,
        pageLength: 10,
        searching: false,
        serverSide: true,
        async: false,
        deferLoading: 0, // This will prevent the default ajax call for logs unless called .draw()
        ajax: getCommunicationLogs,
        columns: communicationLogColumns()
        
    })

    $.sequenceTable = $('#sequenceTable').DataTable({
        paging: true,
        pageLength: 10,
        searching: false,
        serverSide: true,
        async: false,
        deferLoading: 0, // This will prevent the default ajax call for logs unless called .draw()
        "language": {
            "sEmptyTable": "System is updating, please check after some time "
        },
        ajax: getSequence,
        columns: sequenceColumns()

    })

    async function getSequence(data, callback) {
        try {
            let totalLogs = 0;

            let params = {
                clientId: clientId,
                logsFor: logsType,
                pageSize: data.length,
                borrowerOrReferralIds: $.BORROWER_OR_REFERRAL_LOG_ID,
                clientType: clientType,
                pOffset: data.length * Math.ceil(data.start / data.length),
                draw: data.draw,
            }
            let response = await $.ajax({
                url: `${$.ENGAGE_BASE_URL}/all-sequence`,
                type: 'GET',
                data: params,
                headers: { "Authorization": $.getJwt() }
            })
            let callbackObj = {};
            callbackObj.recordsTotal = response.data.length;
            callbackObj.recordsFiltered = $.sequenceTable.page.info().length;
            callbackObj.data = response.data;
            callback(callbackObj);
            $('a.pendingSequenceStop').click(pendingSequenceStop)
        } catch (error) {
            toastr.remove()
            $.toast.error(error)
        }
    }

    function sequenceColumns() {
        return [{
                mRender: function(data, type, row) { return arguments[3].row + arguments[3].settings._iDisplayStart + 1 }
            },
            {
                mRender: function(data, type, row) {
                    if (arguments[2].communicationTypeId == communicationType.CAMPAIGN_SEQUENCE || arguments[2].communicationTypeId == communicationType.AUTO_ALERT_SEQUENCE) {
                        if(arguments[2].ScheduledProcesses[0].campaignType == 'EC'){
                            return 'Event/Date Campaign';
                        }else if(arguments[2].ScheduledProcesses[0].campaignType == 'SC'){
                            return 'Sequence Campaign';
                        }else if(arguments[2].communicationTypeId == communicationType.CAMPAIGN_SEQUENCE){
                            return 'Sequence Campaign';
                        }
                        else{
                            return 'Auto-alert Campaign';
                        }
                    }
                },
            },
            {
                mRender: function(data, type, row) {
                    if (arguments[2].communicationTypeId == communicationType.CAMPAIGN_SEQUENCE || arguments[2].communicationTypeId == communicationType.AUTO_ALERT_SEQUENCE) {
                        return arguments[2].name;
                    } else {
                        return (arguments[2].subject) ? arguments[2].subject : '--';
                    }
                },
            },
            {

                mRender: function(data, type, row) {
                    if (arguments[2].ScheduledProcesses) {
                        return moment.tz(arguments[2].ScheduledProcesses[0].date, 'DD-MM-YYYY hh:mm A', $.CURRENT_TIME_ZONE).format('MM-DD-YYYY hh:mm A')
                    } else {
                        return moment.tz(arguments[2].createdAt, $.CURRENT_TIME_ZONE).local(false).format('MM-DD-YYYY hh:mm A')
                    }
                },
            },
            {
                mRender: function() {
                        return `
                        <a class="pendingSequenceStop" title="Stop Sequence/Campaign" sequenceKey="${arguments[2].ScheduledProcesses[0].sequenceKey}" ><i class="fa fa-ban color-orange-light"></i></a>`;
                }
            }
        ]
    }
    async function pendingSequenceStop() {
        let url;
        $('#scheduleSequenceDelete').modal('show');
        var data = $.sequenceTable.row($(this).parents('tr')).data();
        id = data.id;
        // console.log("data",data)
        if (data.ScheduledProcesses) {
            url = $.ENGAGE_BASE_URL + "schedule-sequence?sequenceKey=" + data.ScheduledProcesses[0].sequenceKey
        } else {
            // url = $.ENGAGE_BASE_URL + "schedule-process?id=" + id
        }
        $('#deleteScheduleSequenceBtn').click(function(e) {
            e.preventDefault();
        let sequenceKey = data.ScheduledProcesses[0].sequenceKey;
            $.ajax({
                url: url,
                data: { communicationFor: clientType, sequenceKey: sequenceKey, borrowerOrReferralId: $.BORROWER_OR_REFERRAL_LOG_ID },
                dataType: "JSON",
                type: 'DELETE',
                headers: { "Authorization": $.getJwt() },
                success: function(data, status) {
                    toastr.remove();
                    $.toast.success(data.message);
                    window.location.reload();
                    $('#scheduleSequenceDelete').modal('hide');
                },
                error: function(err) {
                    toastr.remove();
                    $.toast.error(message.SCHEDULE_EMAIL_DELETING_ERROR);
                }
            });
        })
    };
    /**
     * The column definition for the table communication logs
     */
    function communicationLogColumns() {
        return [{
                mRender: function(data, type, row) {
                    let autoAlertCommunication = [8, 9, 11];
                    let srNo = arguments[3].row + arguments[3].settings._iDisplayStart + 1
                    if ((logsType == communicationType.ALL) && (autoAlertCommunication.includes(arguments[2].communicationTypeId))) {
                        return '<span style="color:red">' + srNo + '</span>';
                    }else if (logsType == communicationType.AUTO_ALERT_SEQUENCE && arguments[2].borrowerCancelledLogs && arguments[2].borrowerCancelledLogs.length) {
                         return   srNo ;
                    }else{
                        return srNo
                    }
                }
            },
            {
                mRender: function(data, type, row) {
                    //console.log("row",row)
                    let communicationTypes = { 'One-To-One Email': 1, 'Schedule Email Campaign': 2, 'Realtime Campaign': 3, 'SMS': 4, 'Mass SMS': 5, 'Trigger Email': 6, 'Schedule SMS Campaign': 7, 'Trigger SMS': 12, 'Auto Alert Response Email': 8, 'Auto Alert Response SMS': 9, 'Sequence Compaign': 10, 'Auto Alert Sequence': 11, }
                    let allEmailCommunication = [2, 3, 6, 8, 10, 11];
                    let autoAlertCommunication = [8, 9, 11];
                    let idsWithInvalidEmail = [];
                    let invalidEmailIcon = '';
                    if ((logsType == communicationType.ALL) && (autoAlertCommunication.includes(arguments[2].communicationTypeId))) {
                        communicationTypes = {'<span style="color:red">Auto Alert Response Email</span>': 8, '<span style="color:red">Auto Alert Response SMS</span>': 9, '<span style="color:red">Auto Alert Sequence</span>': 11, }
                    }
                    // if (allEmailCommunication.includes(arguments[2].communicationTypeId) && logsType == communicationType.AUTO_ALERT_SEQUENCE && arguments[2].borrowerCancelledLogs && arguments[2].borrowerCancelledLogs.length) {
                    //     console.log("ffffffffffffffff",arguments[2].campaignType)
                    //     communicationTypes = `{'<span style="color:red">${arguments[2].campaignType }</span>': ${10}, '<span style="color:red">${arguments[2].campaignType }</span>': ${11}}`
                    //  console.log("communicationTypes",communicationTypes)
                    // }
                    if (allEmailCommunication.includes(arguments[2].communicationTypeId)) {

                        if ([10, 11].includes(arguments[2].communicationTypeId)){// && row.ScheduledProcesses[0].idsWithInvalidEmail) {
                            idsWithInvalidEmail = row//row.ScheduledProcesses[0].idsWithInvalidEmail.split(',')
                        } else if (row.idsWithInvalidEmail) {
                            idsWithInvalidEmail = row.idsWithInvalidEmail.split(',')
                        }

                        if (idsWithInvalidEmail.length && idsWithInvalidEmail.includes(selectedBorrowerRpId))
                            invalidEmailIcon = '<i class="fa fa-exclamation-circle color-red ml-1" title="Invalid Email" aria-hidden="true"></i>';
                    }
                    // console.log("jjjjjjjjjjjjjjjjjj",Object.keys(communicationTypes).find(key => communicationTypes[key] == arguments[2].communicationTypeId))
                    return Object.keys(communicationTypes).find(key => communicationTypes[key] == arguments[2].communicationTypeId) + invalidEmailIcon

                }

            },
            {
                mRender: function(data, type, row) {
                    let autoAlertCommunication = [8, 9, 11];
                    if (arguments[2].communicationTypeId == communicationType.CAMPAIGN_SEQUENCE || arguments[2].communicationTypeId == communicationType.AUTO_ALERT_SEQUENCE) {
                        if ((logsType == communicationType.ALL) && (autoAlertCommunication.includes(arguments[2].communicationTypeId))) {
                            return '<span style="color:red">' + arguments[2].name + '</span>';
                        }else if (logsType == communicationType.AUTO_ALERT_SEQUENCE && arguments[2].borrowerCancelledLogs && arguments[2].borrowerCancelledLogs.length) {
                            return  arguments[2].name ;
                        }else{
                            return arguments[2].title;
                        }
                    } else {
                        let subject = (arguments[2].subject) ? arguments[2].subject : '--'
                        if ((logsType == communicationType.ALL) && (autoAlertCommunication.includes(arguments[2].communicationTypeId))) {
                            return '<span style="color:red">' + subject + '</span>';
                        }else if (logsType == communicationType.AUTO_ALERT_SEQUENCE && arguments[2].borrowerCancelledLogs && arguments[2].borrowerCancelledLogs.length) {
                            return '<span style="color:red">' + subject + '</span>';
                        }else{
                            return subject;
                        }
                    }
                },
            },
            {

                mRender: function(data, type, row) {
                    let autoAlertCommunication = [8, 9, 11];
                    if (arguments[2].ScheduledProcesses) {
                        let date = moment.tz(arguments[2].ScheduledProcesses[0].date, 'DD-MM-YYYY hh:mm A', $.CURRENT_TIME_ZONE).format('MM-DD-YYYY hh:mm A');
                        if ((logsType == communicationType.ALL) && (autoAlertCommunication.includes(arguments[2].communicationTypeId))) {
                            return '<span style="color:red">' + date + '</span>';
                        }else if (logsType == communicationType.AUTO_ALERT_SEQUENCE && arguments[2].borrowerCancelledLogs && arguments[2].borrowerCancelledLogs.length) {
                            return   date ;
                        }else{
                            return date;
                        }
                    } else {
                        let date = moment.tz(arguments[2].createdAt, $.CURRENT_TIME_ZONE).local(false).format('MM-DD-YYYY hh:mm A');
                        if ((logsType == communicationType.ALL) && (autoAlertCommunication.includes(arguments[2].communicationTypeId))) {
                            return '<span style="color:red">' + date + '</span>';
                        }else if (logsType == communicationType.AUTO_ALERT_SEQUENCE && arguments[2].borrowerCancelledLogs && arguments[2].borrowerCancelledLogs.length) {
                            return  date ;
                        }else{
                            return date
                        }
                    }
                },
            },
            {
                mRender: function() {
                    let autoAlertCommunication = [8, 9, 11];
                    if (arguments[2].borrowerCancelledLogs) {
                        if (arguments[2].borrowerCancelledLogs.length) {
                            let cancelledOn = moment.tz(arguments[2].borrowerCancelledLogs, $.CURRENT_TIME_ZONE).local(false).format('MM-DD-YYYY hh:mm A');
                            //return moment.tz(row .canciledOn, $.CURRENT_TIME_ZONE).local(false).format('MM-DD-YYYY hh:mm A')
                            if ((logsType == communicationType.ALL) && (autoAlertCommunication.includes(arguments[2].communicationTypeId))) {
                                return '<span style="color:red">' + cancelledOn + '</span>';
                            }else{
                                if ((logsType == communicationType.AUTO_ALERT_SEQUENCE) ) {
                                    return   cancelledOn ;
                                }else{
                                    return cancelledOn
                                }
                            }
                        } else {
                            if ((logsType == communicationType.ALL) && (autoAlertCommunication.includes(arguments[2].communicationTypeId))) {
                                return '<span style="color:red">' + '--' + '</span>';
                            }else{
                                return '--';
                            }
                        }
                    } else {
                        if ((logsType == communicationType.ALL) && (autoAlertCommunication.includes(arguments[2].communicationTypeId))) {
                            return '<span style="color:red">' + '--' + '</span>';
                        }else{
                            return '--';
                        }
                    }
                }
            },
            {
                mRender: function() {
                    return `
                    <a href="javascript:void(0)" class="view-log" sequenceId ="${arguments[2].id}" text-msg="${arguments[2].communicationContent}" type="${arguments[2].communicationTypeId}" value="${arguments[2].fileName}">
                    <i class="far fa-eye ml-2 color-orange-light" title="View">
                    </a>`;
                }
            }
        ]
    }

    /**
     * Function to get all the communication logs
     */
     //let activityLogClick
    async function getCommunicationLogs(data, callback) {
       try {
            let totalLogs = 0;
            // console.log("activityLogClickggggggggg",activityLogClick)
            if(activityLogClick==1)
            {
                logsType = communicationType.ALL;
            }
            let params = {
                clientId: clientId,
                logsFor: logsType,
                pageSize: data.length,
                borrowerOrReferralIds: $.BORROWER_OR_REFERRAL_LOG_ID,
                clientType: clientType,
                pOffset: data.length * Math.ceil(data.start / data.length),
                draw: data.draw,
                source: 'C'
            }
            if (logsType == communicationType.ALL) {
                getUrl = `${$.ENGAGE_BASE_URL}/all-communication-logs`;
            } else if (logsType == communicationType.CAMPAIGN_SEQUENCE || logsType == communicationType.AUTO_ALERT_SEQUENCE) {
                getUrl = `${$.ENGAGE_BASE_URL}/communication-sequence-logs`;
            } else {
                getUrl = `${$.ENGAGE_BASE_URL}/logs`;
            }

            let response = await $.ajax({
                url: getUrl,
                type: 'GET',
                data: params,
                headers: { "Authorization": $.getJwt() }
            })
           
            let callbackObj = {};
            if (logsType == communicationType.ALL) {
                callbackObj.recordsTotal = response.data.length;
                callbackObj.recordsFiltered = $.communicationLogTable.page.info().length;
            } else {
                if (totalLogs == 0) {
                    totalLogs = response.count;
                }
                    callbackObj.recordsTotal = totalLogs;
             callbackObj.recordsFiltered = totalLogs;

            }


            callbackObj.data = response.data;

            callback(callbackObj);

            $('a.view-log').click(viewLogData)
       } catch (error) {
            console.log(error)
            toastr.remove()
            $.toast.error(error)
         }
    }

    /**
     * Re-initialize the table when switching between
     * the logs category.
     */
    $('#logCategory li').click(function() {
        logsType = $(this).attr('value');
        // console.log("logsTypedddd",logsType)
        activityLogClick=0;
        $.communicationLogTable.clear().draw();
   
    })

    async function viewLogData() {
        let logType = $(this).attr('type');
        var data = $.communicationLogTable.row($(this).parents('tr')).data();
        if (logType == communicationType.SINGLE_EMAIL || logType == communicationType.CAMPAIGN_EMAIL || logType == communicationType.AUTO_ALERT_RESPONSE_EMAIL || logType == communicationType.MASS_EMAIL || logType == communicationType.CUSTOM_EMAIL || logType == communicationType.CUSTOM_SMS) {
            let logsData;

            jQuery.get($.EMAIL_LOGS + clientId + '/' + $(this).attr('value'), function(tempData) {

                initgetBrokerDetails(clientId).then((brokerData) => {
                    logsData = $.replaceTemplatePlaceholders({ broker: brokerData, borrower: borrowerOrReferralInfo }, tempData);
                    $('#logMessageBody').html(logsData);
                    Object.keys(templSignRelation).forEach(key => {
                        if (Number(key) == Number(templateId)) {
                            $('#allSignatureCheckbox > option').each(function() {
                                if (templSignRelation[key] == $(this).val()) {
                                    $(this).prop('selected', true);
                                    // $.DEFAULT_SIGNATURE = templSignRelation[key]; 
                                }
                            });
                        }
                    });
                });

            });



            $('#logsDetailHeading').html('Message Body');
            $('#logDetailModal').modal('show')
        } else if (logType == communicationType.SMS || logType == communicationType.CAMPAIGN_SMS || logType == communicationType.AUTO_ALERT_RESPONSE_SMS || logType == communicationType.MASS_SMS) {
            if(logType != communicationType.AUTO_ALERT_RESPONSE_SMS){
                initgetBrokerDetails(clientId).then((brokerData) => {
                    let logsData = $.replaceTemplatePlaceholders({ broker: brokerData, borrower: borrowerOrReferralInfo }, $(this).attr('text-msg'));
                    $('#logMessageBody').text(logsData)
                }); 
            }else{
                jQuery.get($.SMS_LOGS + clientId + '/' + $(this).attr('value'), function(tempData) {
                    initgetBrokerDetails(clientId).then((brokerData) => {
                        logsData = $.replaceTemplatePlaceholders({ broker: brokerData, borrower: borrowerOrReferralInfo }, tempData);
                        $('#logMessageBody').html(logsData);
                        Object.keys(templSignRelation).forEach(key => {
                            if (Number(key) == Number(templateId)) {
                                $('#allSignatureCheckbox > option').each(function() {
                                    if (templSignRelation[key] == $(this).val()) {
                                        $(this).prop('selected', true);
                                    }
                                });
                            }
                        });
                    });
                });
            }
            $('#logsDetailHeading').html('Message Body');
            $('#logDetailModal').modal('show')
        } else if (logType == communicationType.CAMPAIGN_SEQUENCE || logType == communicationType.AUTO_ALERT_SEQUENCE) {
            fetchSequenceStep(data)
        }
    }
    function fetchSequenceStep(sequenceArray) {
        // console.log("sequenceArray", sequenceArray)
        sequenceArray.selectedBorrowerRpId = selectedBorrowerRpId
        $.ajax({

            url: $.ENGAGE_BASE_URL + "fetch-Sequence-Step-ActivityLog",
            type: 'POST',
            datatype: 'json',
            data: sequenceArray,
            async: false,
            headers: { 'Authorization': $.getJwt() },
            success: function (data) {
                // console.log("data", data)
                let html = '';
                //$('#viewSequenceHeading').html(`<div class = "text-capitalize">${sequenceArray.title}<span class="mr-2"><span class="color-grey ml-2 font-12">( ${sequenceArray.type == campaignTypes.EVENT ? 'Event Campaign' : 'Sequence Campaign'} )</span></span></div>`)
                let cancelled
                let stopSequence
                for (let i = 0; i < data.data.length; i++) {

                    html += `<div class="client-report-info p-3 mb-2">
                      
                      <div class="row" id="HighLevelInfo">
                      <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                          <p class="active-alert-text mb-0">Step:
                          <span class="Futura-PT-Demi text-capitalize">${data.data[i].step}</span>
                          </p>
                      </div>
                      
                      <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                          <p class="active-alert-text mb-0">Sequence Type:
                          <span class="Futura-PT-Demi">${data.data[i].sequenceType == 'E' ? "Email" : 'SMS'}</span>
                          </p>
                      </div>
                   <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                      <p class="active-alert-text mb-0">Template Name:
                      <span class="Futura-PT-Demi text-capitalize">${data.data[i].templateName}</span>
                      </p>
                  </div>
                      `
                    if (sequenceArray.campaignType == "Event campaign") {
                        html += `<div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                          <p class="active-alert-text mb-0">Campaign Date:
                          <span class="Futura-PT-Demi">${data.data[i].campaignDate ? moment.tz(data.data[i].campaignDate, data.data[i].timeZone).local(false).format("MM-DD-YYYY") : 'N/A'}</span>
                          </p>
                      </div>
                      
                      <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                          <p class="active-alert-text mb-0">Campaign Time:
                          <span class="Futura-PT-Demi">${data.data[i].time ? data.data[i].time : 'N/A'}</span>
                          </p>
                      </div>
          
                      <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                          <p class="active-alert-text mb-0">Time Zone:
                          <span class="Futura-PT-Demi">${data.data[i].timeZone ? data.data[i].timeZone : 'N/A'}</span>
                          </p>
                      </div>
                      <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                      <p class="active-alert-text mb-0">View Template:
                      <span class="Futura-PT-Demi"><a title="View" class="font-12 templateModal viewTemplatebtn"      fileName="${data.data[i].fileName}"  tempName="${data.data[i].templateName}"><i class="far fa-eye color-orange-light top-relative"></i></a>
                      </span>
                      </p>
                  </div>`
                    } else {
                        html += `<div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                          <p class="active-alert-text mb-0">Day:
                          <span class="Futura-PT-Demi">${data.data[i].day}</span>
                          </p>
                      </div>
                      
                      <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                          <p class="active-alert-text mb-0">Hour:
                          <span class="Futura-PT-Demi">${data.data[i].hour}</span>
                          </p>
                      </div>
                      <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                          <p class="active-alert-text mb-0">Minute:
                          <span class="Futura-PT-Demi">${data.data[i].minute}</span>
                          </p>
                      </div>
                      <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                      <p class="active-alert-text mb-0">After Step:
                      <span class="Futura-PT-Demi text-capitalize">${data.data[i].afterStep}</span>
                      </p>
                  </div>
                      <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                          <p class="active-alert-text mb-0">View Template:
                          <span class="Futura-PT-Demi"><a title="View" class="font-12 templateModal viewTemplatebtn"      fileName="${data.data[i].fileName}"  tempName="${data.data[i].templateName}"><i class="far fa-eye color-orange-light top-relative"></i></a>
                          </span>
                          </p>
                      </div>
                      `

                    }
                    html += `<div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                    <p class="active-alert-text mb-0">Status:
                    <span class="Futura-PT-Demi text-capitalize">${data.data[i].Status}</span>
                    </p>
                 </div>`
                    html += `</div>
                        </div>`

                    if (data.data[i].Status == "In progress") {
                        stopSequence = true;
                        // cancelled=true
                    }
                    if (data.data[i].Status == "Canceiled") {
                        stopSequence = false;
                        // cancelled=true
                    }

                }

                if (stopSequence) {
                    html += `
                <div class="d-flex align-items-center justify-content-end">
            <button id="stopSequencedr" sequenceKey= "${sequenceArray.sequenceKey}" class="Client-add-btns justify-content-center mt-2 mb-3"><i class="fa fa-ban color-orange-light"></i> <span class="ml-1">
        Stop Sequence/Campaign</span></button></div>`;

                }
                $('#logMessageBody').html(html)
                $('#logDetailModal').modal('show');

            }
        })

    }

    $(document).on('click', "#stopSequencedr", function () {
        let sequenceKey = $(this).attr('sequenceKey');
        $.ajax({
            url: `${$.ENGAGE_BASE_URL}/schedule-sequence/`,
            type: 'DELETE',
            data: { communicationFor: clientType, sequenceKey: sequenceKey, borrowerOrReferralId: $.BORROWER_OR_REFERRAL_LOG_ID },
            dataType: "JSON",
            headers: {
                'Authorization': $.getJwt()
            },
            success: function (response) {

                toastr.remove()
                $.toast.success(response.message)
                $('#snoozedModal').modal('hide');
                $('#logDetailModal').modal('hide');
                $('#communicationLogModal').modal('hide')

            },
            error: function (xhr) {
                toastr.remove()
                $.toast.error(xhr.responseJSON.message)
            }
        })
    })

    

    $("#logMessageBody").on('click', ".viewTemplatebtn", function(e) {
       
        $('#viewTemplateModalHeading').text($(this).attr('tempname'))
        $('#templateBody').empty()
        $('#viewSequenceTemplate').modal('show')
        templateName = $(this).attr('filename');
        templateUrl = `${$.EMAIL_LOGS}${clientId}/`;
        jQuery.get(templateUrl + templateName).done(function(data) {
            if ($('#viewCampaignModalBody tbody').find('tr').length == 1) {
                forScheduledView = true;
                let borrowerData = JSON.parse($('#templateBody tbody').find('td div').attr('recieverData'));
                initgetBrokerDetails(clientId).then((brokerData) => {
                    data = $.replaceTemplatePlaceholders({ broker: brokerData, borrower: borrowerData }, data)
                    $('#tempBody').areaLoader(false);
                    $('#tempBody').empty().append(data)
                })
            } else {
                forScheduledView = false;
                $('#tempBody').areaLoader(false);
                $('#tempBody').empty().append(data)
            }
            
        });
        
    })

    async function viewSequenceSteps(data) {
        let steps = data.SequenceSteps;
        let html = ``;
        stepIdAndCommunicationContent = {};
        let scheduledProcesses = data.ScheduledProcesses;
        let cancelled = false;
        for (let i = 0; i < steps.length; i++) {

            if (checkIfStepSent(data, steps[i].id) == 'Cancelled') {
                cancelled = true;
            }

            scheduledProcesses.forEach(ele => {

                if (steps[i].id == ele.stepId) { // 14 = SENT

                    if (ele.CommunicationLogs.length && ele.CommunicationLogs[0].communicationContent)
                        stepIdAndCommunicationContent[ele.stepId] = ele.CommunicationLogs[0].communicationContent
                        // stepIdAndCommunicationContent[ele.stepId] = ele.CommunicationLogs[0].CommunicationContentId;
                }
            });

            html += `<div class="client-report-info p-3 mb-2">
                        <div class="row" id="HighLevelInfo">
                            <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                                <p class="active-alert-text mb-0">Step:
                                <span class="Futura-PT-Demi text-capitalize">${(steps[i].step).length > 20 ? jQuery.trim(steps[i].step).substring(0, 20).trim(this) + "..." : steps[i].step}</span>
                                </p>
                            </div>
            
                            <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                                <p class="active-alert-text mb-0">After Step:
                                <span class="Futura-PT-Demi text-capitalize">${steps[i].afterStep ? ((steps[i].afterStep).length > 10 ? jQuery.trim(steps[i].afterStep).substring(0, 20).trim(this) + "..." : steps[i].afterStep) : 'N/A'}</span>
                                </p>
                            </div>

                            <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                                <p class="active-alert-text mb-0">Sequence Type:
                                <span class="Futura-PT-Demi">${steps[i].sequenceType == 'E' ? "Email" : 'SMS'}</span>
                                </p>
                            </div>

                            <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                                <p class="active-alert-text mb-0">Template Name:
                                <span class="Futura-PT-Demi text-capitalize" title="${steps[i].templateName}">${(steps[i].templateName).length > 20 ? jQuery.trim(steps[i].templateName).substring(0, 20).trim(this) + "..." : steps[i].templateName}</span>
                                </p>
                            </div>
                    `;
            if (data.type == campaignTypes.EVENT) {
                html += `<div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                                <p class="active-alert-text mb-0">Campaign Date:
                                <span class="Futura-PT-Demi">${steps[i].campaignDate ? moment.tz(steps[i].campaignDate, steps[i].timeZone).local(false).format("MM-DD-YYYY") : 'N/A'}</span>
                                </p>
                            </div>
                            
                            <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                                <p class="active-alert-text mb-0">Campaign Time:
                                <span class="Futura-PT-Demi">${steps[i].time ? steps[i].time : 'N/A'}</span>
                                </p>
                            </div>
                
                            <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                                <p class="active-alert-text mb-0">Time Zone:
                                <span class="Futura-PT-Demi">${steps[i].timeZone ? steps[i].timeZone : 'N/A'}</span>
                                </p>
                            </div>`;
            } else {


                `<div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                                <p class="active-alert-text mb-0">Day:
                                <span class="Futura-PT-Demi">${steps[i].day ? steps[i].day : 'N/A'}</span>
                                </p>
                            </div>
            
                            <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                                <p class="active-alert-text mb-0">Hour:
                                <span class="Futura-PT-Demi">${steps[i].hour ? steps[i].hour : 'N/A'}</span>
                                </p>
                            </div>
                             
                            <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                                <p class="active-alert-text mb-0">Minute:
                                <span class="Futura-PT-Demi">${steps[i].minute ? steps[i].minute : 'N/A'}</span>
                                </p>
                            </div>
                `;
            }
            html += `<div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                                <p class="active-alert-text mb-0">Status:
                                <span class="Futura-PT-Demi">${checkIfStepSent(data, steps[i].id)}</span>
                                </p>
                            </div>

                            <div class="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4">
                                <p class="active-alert-text mb-0">View Template:
                                <span class="Futura-PT-Demi"><a class="font-13 templateModal viewTempbtn" title="View" stepId="${steps[i].sequenceType==communicationCategory.EMAIL ? steps[i].id : ''}" communicationType="${steps[i].Template.communicationType}" fileName="${steps[i].Template.fileName}" messageBody="${steps[i].Template.body}" tempId="${steps[i].Template.id}" tempName="${steps[i].Template.name}" tempTitle="${steps[i].Template.title}" tempSubject="${steps[i].Template.subject}"><i class="far fa-eye color-orange-light top-relative"></i></a>
                                </span>
                                </p>
                            </div>
                        </div>
                    </div>`;
        }
        if (data.ScheduledProcesses.length != data.SequenceSteps.length) {
            html += `<div class="d-flex align-items-center justify-content-end">
            <button id="stopSequence" sequenceKey= "${data.ScheduledProcesses[0].sequenceKey}" ${cancelled ? 'disabled' : ''} class="${cancelled ? 'Client-add-btns-disable' : 'Client-add-btns'} justify-content-center mt-2 mb-3"><i class="fa fa-ban color-orange-light"></i> <span class="ml-1">
        Stop Sequence/Campaign</span></button></div>`;
        }
        $('#logMessageBody').html(html)
        $('#logDetailModal').modal('show')

        $('#stopSequence').click(function() {
            let sequenceKey = $(this).attr('sequenceKey');
            $.ajax({
                url: `${$.ENGAGE_BASE_URL}/schedule-sequence/`,
                type: 'DELETE',
                data: { communicationFor: clientType, sequenceKey: sequenceKey, borrowerOrReferralId: $.BORROWER_OR_REFERRAL_LOG_ID },
                dataType: "JSON",
                headers: {
                    'Authorization': $.getJwt()
                },
                success: function(response) {

                    toastr.remove()
                    $.toast.success(response.message)
                    $('#snoozedModal').modal('hide');
                    $('#logDetailModal').modal('hide');
                    $('#communicationLogModal').modal('hide')

                },
                error: function(xhr) {
                    toastr.remove()
                    $.toast.error(xhr.responseJSON.message)
                }
            })
        })


    }

    function gettingSentEmailSequence(stepId) {
        let result = false;
        Object.keys(stepIdAndCommunicationContent).forEach(key => {

            if (stepId == key) {
                let replacedData = $.replaceTemplatePlaceholders({ broker: clientInfo, borrower: borrowerOrReferralInfo }, stepIdAndCommunicationContent[key])
                $('#tempBody').areaLoader(false);
                $('#tempBody').empty().append(replacedData)
                result = true;
                return;
            }
        })

        return result;
    }
    $('#logDetailModal').on('hide.bs.modal', function() { $('#logMessageBody').empty() })

    $("#logMessageBody").on('click', ".viewTempbtn", function(e) {
        $('#viewTemplateModalHeading').text($(this).attr('tempname'))
        if ($(this).attr('communicationtype') == communicationCategory.EMAIL) {
            $('#tempBody').areaLoader(true);
            templateName = $(this).attr('filename')
            let stepId = $(this).attr('stepId');
            let tempId = $(this).attr('tempId');
            let filledCommunicationContent = false;
            if (stepId) {
                filledCommunicationContent = gettingSentEmailSequence(stepId);
            }
            if (!filledCommunicationContent) {
                jQuery.get($.TEMPLATES + templateName).done(function(data) {
                    $('#tempBody').areaLoader(false);
                    let replacedData = $.replaceTemplatePlaceholders({ broker: clientInfo, borrower: borrowerOrReferralInfo }, data)
                    $('#tempBody').empty().append(replacedData)
                    let alreadySelected = false;
                    Object.keys(templSignRelation).forEach(key => {
                        if (Number(key) == Number(tempId)) {
                            $('#allSignatureCheckbox > option').each(function() {
                                if (templSignRelation[key] == Number($(this).val())) {
                                    alreadySelected = true;
                                    $(this).prop('selected', true);
                                    $('#applySignature').trigger('click');
                                }
                            });
                        }
                    });
                    if (!alreadySelected) {
                        renderDefaultTemplate(emailType.GENERAL, communicationCategory.SIGNATURE);
                    }

                });
            }
        } else {
            let body = $(this).attr('messagebody');
            let replacedData = $.replaceTemplatePlaceholders({ broker: clientInfo, borrower: borrowerOrReferralInfo }, body)
            $('#tempBody').text(replacedData);
        }

        $('#viewSequenceTemplate').modal('show')

    })

    $('#viewTemplateCancelBtn').click(function() {
        $('#viewSequenceTemplate').modal('hide');
    })



    $('input[name=defaultTemplateType]').change(async function() {
        templateSelectionType = $(this).val();
        if (templateSelectionType == emailType.GENERAL) {
            $("#generalTemplate").attr('checked', true).trigger('click');
        } else {
            $("#autoAlertTemplate").attr('checked', true).trigger('click');
        }
        await renderDefaultTemplate(templateSelectionType, communicationCategory.EMAIL);
        await renderDefaultSignature(defaultTemplateId);
        getAllClientTemplates(templateSelectionType);
    })

    $('input[name=templateSelectionType]').change(function() {
        templateSelectionType = $(this).val();
        getAllClientTemplates(templateSelectionType);
    })

    $('#sendEmail').click(sendEmail)
    $('#sendSmsBtn').click(sendSms)


    /**
     * Register and listen to the close events of popups
     */

    $('#communicationModal').on('hide.bs.modal', function() {
        if (!canCloseEditor) $('#discardConfirmationModal').modal('show')
        $('#emailTab').trigger('click');
    })

    $('#discardYes').click(clearFields)
    $('#discardNo').click(function() {
        $('#communicationModal').modal('show')
    })

    $('#emailClearBtn').click(clearFields)
    $('#smsClearBtn').click(clearFields)


    /**
     * Sms Template implementation
     */
    $('#publicTemplateSms').click(()=>{
        getAllSmsTemplates($('input[name=smsTemplateSelectionType]:checked').val());
    });
    let allSmsTemplates = [];
    async function getAllSmsTemplates(smsType) {
        publicTemplateSms = $('#publicTemplateSms').prop('checked') ? true : false;
        try {
            await $.ajax({
                url: $.COMMON_BASE_URL + "templates?clientId=" + clientId + "&type=" + smsType + "&statusId=" + status.ACTIVE + "&communicationType=" + communicationCategory.SMS+"&publicTemplate="+publicTemplateSms,
                type: 'GET',
                headers: { 'Authorization': $.getJwt() },
                success: function(data) {
                    templateObj = data;
                    data = templateObj.templatesData;   
                    if (data.length > 0) {
                        allSmsTemplates = data;
                    } else {
                        allSmsTemplates = [];
                    }
                    renderSmsTemplatesList();
                    if(publicTemplateSms){
                        $(document).find('#standardTemplateSms').hide();
                        $(document).find('#standardTemplateSms').prev().hide();
                    }
                    else{
                        $(document).find('#standardTemplateSms').show();
                        $(document).find('#standardTemplateSms').prev().show();
                    }
                }
            })
        } catch (error) {
            console.log(error, "error");
        }
    }

    $('#selectedSmsTemplateName').html('Please select template from settings');
    async function setSelectedSmsTemplateContent(selectedTemplateId) {
        try {
            let isDefaultTemplate = selectedTemplateId == 'default';
            if (selectedTemplateId == 'default') {
                let smsTempType = $('input[name=smsDefaultTemplateType]:checked').val();
                let defaultSmsTemplate = allSmsTemplates.find(e => e.isDefaultTemplate == true && e.type == smsTempType);
                if (defaultSmsTemplate) {
                    selectedTemplateId = defaultSmsTemplate.id;
                }
            }

            let smsTemp = selectedTemplateId != 'default' ? allSmsTemplates.find(e => e.id == selectedTemplateId) : null;
            if (smsTemp) {
                let calendarLink;
                if (borrowerOrReferralInfo.brokerLoFirstName) {
                    calendarLink = await getCalendarLinkByLOName(borrowerOrReferralInfo);
                }

                let body = $.replaceTemplatePlaceholders({ broker: clientInfo, borrower: borrowerOrReferralInfo, calendarLink: calendarLink }, smsTemp.body);

                // let body = await replacePlaceHolders(smsTemp.body)

                $('#smsContent').val(body);

                $('#selectedSmsTemplateName').html(smsTemp.name);
                if (smsTemp.type == 'G') {
                    $('#generalSms').prop('checked', true);
                } else {
                    $('#autoAlertSms').prop('checked', true);
                }
            } else {
                $('#selectedSmsTemplateName').html('Please select template from settings');
                $('#smsContent').val('');
            }
        } catch (error) {
            console.log(error, "error");
        }
    }

    $('input[name=smsDefaultTemplateType]').change(function() {
        templateType = $(this).val();
        renderDefaultTemplate(templateType, communicationCategory.SMS)
        setSelectedSmsTemplateContent('default');
    })
    $('#smsTab').click(function() {
        templateType = emailType.GENERAL
        renderDefaultTemplate(templateType, communicationCategory.SMS)
        setSelectedSmsTemplateContent('default');
    });


    function renderSmsTemplatesList() {
        try {
            $('#smsTemplatesRenderSection').empty()
            $('#smsTemplatesRenderSection').html(`
            <div id="generalTemplateSms">
                <div class="col-12 p-0 mb-3">
                <div class="row d-none">
                    <div class="col-12 pl-3" id="publicSmsTemplateHeading">
                        <label class="details-text color-grey">Public</label>
                    </div>
                </div> 
                    <div class="row" id="publicTemplateSms">
                    </div>
                    <div class="row">
                        <div class="col-12 pl-3" id="customTemplateHeading">
                            <label class="details-text color-grey">Custom</label>
                        </div>
                    </div> 
                    <div class="row" id="customTemplateSms">
                    </div>
                </div>

                <div class="col-12 p-0">
                    <div class="row">
                        <div class="col-12 pl-3" id="standardTemplateHeading">
                            <label class="details-text color-grey">Standard</label>
                        </div>
                    </div> 
                    <div class="row" id="standardTemplateSms">
                    </div>
                </div>
            </div>
            <div  class="row" id="autoAlertRespTepmSms">
            </div>
            <div class="row m-0 viewTemp"></div>
            `);

            // ============================to show all parent that create tamplate=start========================
            $('#publicTemplateSms').empty();
            for(let i=0; i < Users.length; i++){
                $('#publicTemplateSms').append(`
                    <div class="col-12">
                        <label class="details-text color-grey">${Users[i].firstName+' '+ Users[i].lastName}</label>
                        <div class="row" parentId="${Users[i].clientId}" id="parentIdSms${Users[i].clientId}"></div>
                    </div>
                `);
            }
            // ============================to show all parent that create tamplate=End========================

            $('#emailTemplateSection').hide();
            $('#smsTemplateSection').show();
            $('.viewTemp').html('');
            let allRequiredSmsTemplates = allSmsTemplates

            if ($("#generalSmsTemplate").prop('checked')) {
                $('#generalTemplateSms').show();
                $('#autoAlertRespTepmSms').hide();
            } else {
                $('#generalTemplateSms').hide();
                $('#autoAlertRespTepmSms').show();
            }
            $('#customTemplateSms').html('');
            $('#standardTemplateSms').html('');
            $('#autoAlertRespTepmSms').html('');
            // $('#smsTemplatesRenderSection').html('');
            let tempNotFoundHTML = `
            <div class= 'col-12'>
            <div class="border no-data-div">
                <p class="details-text-label mb-0">No templates found</p>
            </div>
            </div > `;
            let customTempEmptySms = true,
            standardTempEmptySms = true,
            publicTemplateSms = true;
            let smsPublicTemplateParents=[];    
            if (allRequiredSmsTemplates.length > 0) {
                for (let i = 0; i < allRequiredSmsTemplates.length; i++) {
                    const template = allRequiredSmsTemplates[i];
                    var html = `
                    <div class= "col-lg-3 col-md-4 col-sm-6 col-12 mb-2" >
                    <div class="template-card-grey rounded p-2 px-2 d-flex justify-content-between align-items-center overflow-hidden">
                        <label class="custom-checkbox mb-0 font-14 template-title" data-toggle="tooltip" data-placement="top" title="${template.name}"> <input type="radio" isDefault="${template.isDefaultTemplate}" tempType ="${template.type}" name="templateconnectSms" value='${template.id}'> <span class="checkmark"></span>${template.name}</label>
                            <div class="d-flex align-items-center">
                                <span class="view-icon cursor-pointer font-13" templateName="${template.name}" value="${template.fileName}" content="${template.body}" tempType="${template.type}"><i class="far fa-eye color-orange-light"></i></span>
                                ${template.isPublic ? `<div class="public-label clientId${template.clientId}" title="${localStorage.getItem("fullName")}'s Template"><div class="public-text">P</div></div>`:  '' }
                            </div>
                        </div>
                    </div>
                    `;
                    if ($("#generalSmsTemplate").prop('checked')) {
                        if (template.clientId) {
                            $('#customTemplateSms').append(html);
                            customTempEmptySms = false;
                        } 
                        else {
                            $('#standardTemplateSms').append(html);
                            standardTempEmptySms = false;
                        }
                    } else {
                        $('#autoAlertRespTepmSms').append(html);
                    }
                }
                customTempEmptySms ? $('#customTemplateSms').html(tempNotFoundHTML) : '';
                standardTempEmptySms ? $('#standardTemplateSms').html(tempNotFoundHTML) : '';
                $('input[name=templateSms').each(function() {
                    if ($(this).attr('isDefault') == 'true') {
                        $(this).attr('checked', true);
                    }
                })
                $('#smsTemplatesRenderSection span.view-icon').click(displaySmsTemplateDetails)
            } else {
                $('#smsTemplatesRenderSection').html(tempNotFoundHTML);
            }
            if(Users)
            for(let i=0; i < Users.length; i++){
                $(document).find(`.clientId${Users[i].clientId}`).attr('title', `${Users[i].firstName + ' ' + Users[i].lastName}'s Template`);
                if((parentIdWithType[Users[i].clientId]==parentType.ROOT_PARENT || parentIdWithType[Users[i].clientId]==parentType.LO) && Users[i].clientId!=clientId){
                    $(document).find(`.clientId${Users[i].clientId}`).addClass('public-label-grey');
                }
                else if(parentIdWithType[Users[i].clientId]==parentType.BRANCH && Users[i].clientId!=clientId){
                    $(document).find(`.clientId${Users[i].clientId}`).addClass('public-label-blue');
                }
            }

        } catch (error) {
            console.log(error, "error");
        }
    }

    /***************************************************************************************/
    //Code related to displaying template details.
    /***************************************************************************************/
    $('#closeViewSmsTempBtn').hide();

    $(document).on('click', "#smsTemplatesRenderSection span.viewSmsTemplate", function() {
        let tn = $(this).attr('templateName');
        let tc = $(this).attr('content');
        let mainDiv = $('#smsTemplatesRenderSection');
        $('#selectTemplateHeader').empty();
        $('#selectTemplateHeader').html(tn);
        mainDiv.empty();
        let text = `
                < div >
                <div>${tc}</div></ br >
            </div > `;

        mainDiv.append(text);
        $('#chooseCancelBtn').hide();
        $('#smsTemplateTypeDiv').hide();
        $('#closeViewSmsTempBtn').show();
    });

    $(document).on('click', "#closeViewSmsTempBtn,#templateSelectionModal .close", function() {
        $('#clientTemplates').prev().addClass('d-flex');
        $('#clientTemplates').prev().show();  
        $('#selectTemplateHeader').empty();
        $('#selectTemplateHeader').html('Select Template');
        $('#closeViewSmsTempBtn').hide();
        $('#smsTemplateTypeDiv').show();
        $('#chooseCancelBtn').show();
        $('#chooseConnectTemplateSms').show();
        renderSmsTemplatesList();
    })

    /***************************************************************************************/
    //End of code related to displaying displaying template details.
    /***************************************************************************************/

    $('input[name=smsTemplateSelectionType]').click(() => {
        let selectedSmsTempType = $('input[name=smsTemplateSelectionType]:checked').val();
        getAllSmsTemplates(selectedSmsTempType);
        $('input[name=smsDefaultTemplateType]').each((index, data) => {
            if (data.value == selectedSmsTempType) data.checked = true
            else data.checked = false;
        })

    })
    
    $('#chooseSmsTemplateButton').click(() => { 
        $("#emailTemplateSection").hide()
        $('#cancelViewBtn').hide();
        $('#clientTemplatesSms').hide();
        $("#chooseConnectTemplateEmail").hide()
        $("#chooseConnectTemplateSms").show()
        $('#clientTemplates').empty();
        $('#publicTemplateSms').prop('checked',false);
        if ($('#generalSms').prop('checked')) {
            $('#generalSmsTemplate').trigger('click');
            $('#autoAlertSms').prop('checked', false)
            getAllSmsTemplates(emailType.GENERAL);
            $('#generalSms').prop('checked', true)
        } else if ($('#autoAlertSms').prop('checked')) {
            $('#generalSmsTemplate').prop('checked', false);
            $("input[name=smsTemplateSelectionType][value='A']").prop("checked", true);
            getAllSmsTemplates(emailType.AUTO_ALERT_RESPONSE_EMAIL);
        } else if (!$('#generalSms').prop('checked') && !$('#autoAlertSms').prop('checked')) {
            getAllSmsTemplates(emailType.GENERAL);
        }
        $('#templateSelectionModal').modal('show')
    })

    $(document).on('click', ".smsCommunicate", function() {
        $('#emailClearBtn').trigger('click');
        $('#emailTrackingSequence').val('');
        $('#emailTrackingSequenceNo').prop('checked',true)
        setSelectedSmsTemplateContent('default')
    })

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function replacePlaceHolders(body) {
        Object.keys(placeholderObj).forEach(e => {
            body = body.replace(new RegExp(escapeRegExp(e), 'g'), placeholderObj[e]);
        })
        return body;
    }

    var placeholders = [
        { name: "First Name ", text: "{{FName}}" },
        { name: "Last Name", text: "{{LName}}" },
        { name: "Street Address", text: "{{StreetAddress}}" },
        { name: "City", text: "{{City}}" },
        { name: "State", text: "{{State}}" },
        { name: "ZipCode", text: "{{ZipCode}}" },
        { name: "Phone", text: "{{Phone}}" },
        { name: "Email", text: "{{Email}}" },
        { name: "User Name", text: "{{UserName}}" },
        { name: "User First Name", text: "{{UserFName}}" },
        { name: "User Last Name", text: "{{UserLName}}" },
        { name: "User Email", text: "{{UserEmail}}" },
        { name: "User  Phone", text: "{{UserPhone}}" },
        { name: "User Company Name", text: "{{UserCompanyName}}" },
        { name: "User Street Address", text: "{{UserStreetAddress}}" },
        { name: "User City", text: "{{UserCity}}" },
        { name: "User State", text: "{{UserState}}" },
        { name: "User ZipCode", text: "{{UserZipCode}}" },
        { name: "User NMLS", text: "{{UserNmls}}" },
        { name: "User Profile Picture", text: "{{UserProfilePicture}}" },
        { name: "MPOC Name", text: "{{MPOCName}}" },
        { name: "MPOC Email", text: "{{MPOCEmail}}" },
        { name: "MPOC  Phone", text: "{{MPOCPhone}}" },
        { name: "MPOC Street Address", text: "{{MPOCStreetAddress}}" },
        { name: "MPOC City", text: "{{MPOCCity}}" },
        { name: "MPOC State", text: "{{MPOCState}}" },
        { name: "MPOC ZipCode", text: "{{MPOCZipCode}}" },
        { name: "MPOC NMLS", text: "{{MPOCNmls}}" },
        { name: "MPOC Profile Picture", text: "{{MPOCProfilePicture}}" },
        { name: "Current Date", text: "{{CurrentDate}}" },
        { name: "DOB", text: "{{DOB}}" },
        { name: "Closing Date", text: "{{ClosingDate}}" },
        { name: "Type Of Loan", text: "{{TypeOfLoan}}" },
        { name: "Calendar Link", text: "{{CalendarLink}}" },


    ];

    let placeholderObj = {
        '{{FName}}': '{{FName}}',
        '{{LName}}': '{{LName}}',
        "{{StreetAddress}}": '{{StreetAddress}}',
        '{{City}}': '{{City}}',
        "{{State}}": '{{State}}',
        '{{ZipCode}}': '{{ZipCode}}',
        '{{Phone}}': '{{Phone}}',
        '{{Email}}': '{{Email}}',
        '{{UserName}}': '{{UserName}}',
        '{{UserFName}}': '{{UserFName}}',
        '{{UserLName}}': '{{UserLName}}',
        '{{UserEmail}}': '{{UserEmail}}',
        '{{UserPhone}}': '{{UserPhone}}',
        '{{UserCompanyName}}': '{{UserCompanyName}}',
        '{{UserStreetAddress}}': '{{UserStreetAddress}}',
        '{{UserCity}}': '{{UserCity}}',
        '{{UserState}}': '{{UserState}}',
        '{{UserZipCode}}': '{{UserZipCode}}',
        '{{UserNmls}}': '{{UserNmls}}',
        '{{UserProfilePicture}}': '{{UserProfilePicture}}',
        '{{MPOCName}}': '{{MPOCName}}',
        '{{MPOCEmail}}': '{{MPOCEmail}}',
        '{{MPOCPhone}}': '{{MPOCPhone}}',
        '{{MPOCStreetAddress}}': '{{MPOCStreetAddress}}',
        '{{MPOCCity}}': '{{MPOCCity}}',
        '{{MPOCState}}': '{{MPOCState}}',
        '{{MPOCZipCode}}': '{{MPOCZipCode}}',
        '{{MPOCNmls}}': '{{MPOCNmls}}',
        '{{MPOCProfilePicture}}': '{{MPOCProfilePicture}}',
        '{{CurrentDate}}': '{{CurrentDate}}',
        '{{DOB}}': '{{DOB}}',
        '{{ClosingDate}}': '{{ClosingDate}}',
        '{{TypeOfLoan}}': '{{TypeOfLoan}}',
        '{{CalendarLink}}': '{{CalendarLink}}',

    }

    /**
     *  appen placeholder in li  and display in text area of sms
     */
    for (var i = 0; i < placeholders.length; i++) {
        $("#placeholderUl").append($('<li />').html(placeholders[i].text).attr('title', placeholders[i].name).mousedown(function(event) { event.preventDefault(); }).click(function(event) {
            var smsText = jQuery("#smsContent");
            var caretPos = smsText[0].selectionStart;
            var textAreaTxt = smsText.val();
            var appendedText = $(this).html();
            let appendedTextReplacedData = placeholderObj[appendedText];
            smsText.val(textAreaTxt.substring(0, caretPos) + appendedTextReplacedData + textAreaTxt.substring(caretPos));
            $("#placeholderDropown").hide();
        }));
    }

    $("#placeholders").click(function() {
        $("#placeholderDropown").toggle();
    })

    $('#chooseConnectTemplateSms').click(function() {
        let selectedSmsTemplateId = $('input[name=templateconnectSms]:checked').val();
        if (selectedSmsTemplateId) {
            setSelectedSmsTemplateContent(selectedSmsTemplateId);
            $('#templateSelectionModal').modal('hide')
        } else {
            toastr.remove()
            toastr.error(message.CHOOSE_TEMPLATE);
            return
        }

    })

    $('#chooseConnectTemplateEmail').click(function() {
        renderSelectedTemplate()
    })
    
    async function displaySmsTemplateDetails() {
        $('#closeViewSmsTempBtn').show();
        $('#closeViewTempBtn').hide();      
        let tc = $(this).attr('content');
        let calendarLink;
        if (borrowerOrReferralInfo.brokerLoFirstName) {
            calendarLink = await getCalendarLinkByLOName(borrowerOrReferralInfo);
        }
        tc = $.replaceTemplatePlaceholders({ broker: clientInfo, borrower: borrowerOrReferralInfo, calendarLink: calendarLink }, tc);
        let tn = $(this).attr('templateName');
        $('#cancelViewBtn').show();
        let mainDiv = $(document).find('#smsTemplatesRenderSection div.viewTemp');
        console.log('mainDiv',mainDiv)
        $('#selectTemplateHeader').empty();
        $('#selectTemplateHeader').html(tn);
        mainDiv.empty();
        let text = `
                <div class="width-100-lg"> `

        text += `
                    <div> ${tc}</div></br>
            </div> `;
        
        if(~window.location.href.indexOf('clientdashboard'))
        //$('#smsTemplateSection>div').removeClass('d-flex').addClass('d-none');
        // $('#smsTemplateSection>div').removeClass('d-flex')
        $('#smsTemplateSection').hide();    
        $('#smsTemplatesRenderSection').removeClass('d-flex')
        mainDiv.append(text);
        $('#chooseCancelBtn').hide();
        $('#chooseConnectTemplateSms').hide();
        $('#smsTemplateTypeDiv').hide();
        $('#closeViewSmsTempBtn').show();
        $('#generalTemplateSms,#autoAlertRespTepmSms').hide();
        // $('#smsTemplateSection').hide();
    }
    async function getAllSignatureTemplates() {
        let templates = await $.ajax({
            // + "&type=" + emailType.GENERAL + "&statusId=" + status.ACTIVE + "&communicationType=" + communicationCategory.SIGNATURE,
            url: $.COMMON_BASE_URL + "templates?type=" + templateSelectionType + "&statusId=" + status.ACTIVE + "&communicationType=" + communicationCategory.SIGNATURE,
            type: 'GET',
            data: { clientId: clientId },
            headers: { "Authorization": $.getJwt() }
        });
        templates=templates.templatesData;
        if (templates.length > 0) {
            $('#allSignatureCheckbox').empty();
            $('#allSignatureCheckbox').append('<option disabled>Select Signature</option>')
            for (var i = 0; i < templates.length; i++) {
                $('#allSignatureCheckbox').append(
                    `<option class="custom-checkbox font-14" title="${templates[i].name}" fileName="${templates[i].fileName}" value="${templates[i].id}">
                    ${templates[i].name.length > 10 ? templates[i].name.slice(0,20)+'...': templates[i].name}
                </option>`);

            }
        } else {
            $('#allSignatureCheckbox').html(`<option disabled>No Signature Found</option>`)
        }

    }

    getAllSignatureTemplates()

    $('#allSignatureCheckbox').on('change', function() {
        $('#allSignatureCheckbox').attr('title', $('#allSignatureCheckbox :selected').attr('title'));
        $('#applySignature').removeClass('disabled-link')
    });

    $('#applySignature').click(function() {
        let val = $('#allSignatureCheckbox :selected').val();
        $('#allSignatureCheckbox').attr('title', $('#allSignatureCheckbox :selected').attr("title"));
        $.FILE_NAME = $('#allSignatureCheckbox :selected').attr("filename");
        if ($.FILE_NAME) {
            jQuery.get($.TEMPLATES + $.FILE_NAME, function(data) {
                $(".Editor-container").show()
                $('.editor').areaLoader(false)
                $('.added_signature').remove();
                let replacedData = $.replaceTemplatePlaceholders({ broker: clientInfo, borrower: borrowerOrReferralInfo }, data)
                $('.Editor-editor,#clientTemplates>div,#tempBody').append(`<!--signature--><div class="added_signature" tempId="${val}">${replacedData}<div>`);
                $('#applySignature').addClass('disabled-link')
            });
        }
    });

    //===============================get All template and signature relation by clientId=start=========
    function templateSignatureRelation() {
        $.ajax({
            url: $.COMMON_BASE_URL + "templateSignatureRelation/" + clientId,
            type: 'GET',
            async: false,
            headers: { 'Authorization': $.getJwt() },
            success: function(data) {
                templSignRelation = data;
                // Object.keys(templSignRelation).forEach(element => {
                // });
            }
        })
    }
    templateSignatureRelation();
    //===============================get All template and signature relation by clientId=end=============
})

function checkIfStepSent(data, stepId) {
    let scheduledProcessData = data.ScheduledProcesses.find(s => s.stepId == stepId);
    let borrowerCancelledLogs = data.borrowerCancelledLogs;

    if (!scheduledProcessData && borrowerCancelledLogs.length) {
        return 'Cancelled';
    } else if (!scheduledProcessData) {
        // return 'N/A';
        return 'Pending';
    }


    let ids;
    if (clientType == communicationFor.BORROWER) {
        ids = scheduledProcessData.borrowerDatabaseIds;
        if (ids == 'ALL') {
            if (borrowerCancelledLogs.find(s => (s.scheduledProcessId == scheduledProcessData.id && s.borrowerId == $.BORROWER_OR_REFERRAL_LOG_ID))) {
                return "Cancelled";
            } else if (scheduledProcessData.statusId == 1) {
                return "Pending";
            } else if (scheduledProcessData.statusId == 14) {
                return "Sent";
            }else if(scheduledProcessData.statusId == 30) {
                return "N/A";
            }else if(scheduledProcessData.statusId == 17) {
                return "Failed";
            }

        } else {
            let dataIds = ids.split(",");
            if (dataIds.includes($.BORROWER_OR_REFERRAL_LOG_ID)) {
                if (scheduledProcessData.statusId == 1) {
                    return "Pending";
                } else if (scheduledProcessData.statusId == 14) {
                    return "Sent";
                }else if (scheduledProcessData.statusId == 30) {
                    return "N/A";
                }else if(scheduledProcessData.statusId == 17) {
                    return "Failed";
                }
            } else {
                if (borrowerCancelledLogs.find(s => (s.scheduledProcessId == scheduledProcessData.id && s.borrowerId == $.BORROWER_OR_REFERRAL_LOG_ID))) {
                    return "Cancelled";
                }
            }
        }
    } else if (clientType == communicationFor.REFERRAL_PARTNER) {
        ids = scheduledProcessData.referralPartnerIds;
        if (ids == 'ALL') {
            if (borrowerCancelledLogs.find(s => (s.scheduledProcessId == scheduledProcessData.id && s.unmonitoredId == $.BORROWER_OR_REFERRAL_LOG_ID))) {
                return "Cancelled";
            } else if (scheduledProcessData.statusId == 1) {
                return "Pending";
            } else if (scheduledProcessData.statusId == 14) {
                return "Sent";
            }else if (scheduledProcessData.statusId == 30) {
                return "N/A";
            }
        } else {
            let dataIds = ids.split(",");
            if (dataIds.includes($.BORROWER_OR_REFERRAL_LOG_ID)) {
                if (scheduledProcessData.statusId == 1) {
                    return "Pending";
                } else if (scheduledProcessData.statusId == 14) {
                    return "Sent";
                }else if (scheduledProcessData.statusId == 30) {
                    return "N/A";
                }
            } else {
                if (borrowerCancelledLogs.find(s => (s.scheduledProcessId == scheduledProcessData.id && s.unmonitoredId == $.BORROWER_OR_REFERRAL_LOG_ID))) {
                    return "Cancelled";
                }
            }
        }
    }

}