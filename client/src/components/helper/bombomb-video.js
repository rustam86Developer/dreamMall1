// const APIKEY = '405158d8-9679-2da1-60e0-7e131c867975';
/**
 * @author : Asish Singh
 * @Description : Bombbomb Video Implementation
 */


var videoInfomation;
var bb;
var uploadedVideoInfo;
var isApikeyValid;
var apikey;
$('#noVideoFound').hide();
if (localStorage.getItem('systemUserTypeId') == systemUserType.ADMIN) {
    $('#videoRecorderModalBtn').hide();
} else {
    $('#videoRecorderModalBtn').show();
}

getBombbombApikey();

// Fetch Api Key From Database

function getBombbombApikey() {

    $.ajax({
        url: $.COMMON_BASE_URL + "thirdparty-apikey",
        type: 'GET',
        data: {
            clientId: localStorage.getItem('clientId'),
            thirdPartyTypeId: thirdPartyTypes.BOMBBOMB,
            type: callbackTypes.VIDEO
        },
        datatype: 'json',
        headers: { 'Authorization': $.getJwt() },
        success: function(data) {

            if (data) {
                apikey = data.apikey;
                validateBombbombApi(apikey)
            } else {
                isApikeyValid = false
            }
        }
    })
}

// Check If Api key is valid from bombbomb server

function validateBombbombApi(apikey) {
    bb = new BBCore({ accessToken: apikey, onerror: OnInvalidTokenCallback });
    isApikeyValid = bb.authenticated;
}

// Open Video Recorder

$('#videoRecorderModalBtn').click(function() {

    initVideoRecorder();
})

// initialize video recorder

function initVideoRecorder() {

    if (!isApikeyValid) {
        toastr.remove();
        toastr.error(message.BOMBBOMB_APIKEY_REQUIRED);
        setTimeout(() => {
            window.open('https://join.bombbomb.com/stikkum/', '_blank');
        }, 3000);

        return
    }

    $('#videoRecorderModal').modal('show');
    $('#areaLoader').areaLoader(true);
    setTimeout(() => {
        $('#areaLoader').areaLoader(false);
    }, 4000);
    bb.startVideoRecorder({ target: '#recorderDiv' }, function(vidInfo) {
        videoInfomation = vidInfo;
    });

}

// Function To Save Video In Bombbomb Server

$('#saveVideoBtn').click(function() {

    if (!videoInfomation) {
        toastr.remove();
        toastr.error(message.VIDEO_REQUIRED);
        return
    }
    let videoTitle = $('#videoTitle').val();
    if (!videoTitle) {
        toastr.remove();
        toastr.error(message.VIDEO_TITLE);
        return
    }
    $('#saveVideoBtn').showMiniLoader('Saving');
    bb.saveRecordedVideo(videoTitle, videoInfomation.videoId, videoInfomation.filename, function(data) {
        uploadedVideoInfo = data;
        toastr.success(message.VIDEO_SAVED);
        $('#saveVideoBtn').hideMiniLoader('Save');
        $('#embedVideoModal').modal('show');

    });

});

//If User Want To Embed The Recorded Video In The Editor

$('#embedVideoYes').click(function() {
    let gifUrl = uploadedVideoInfo.info.animated_thumb_url;
    let videoUrl = uploadedVideoInfo.info.video_urls.H264Main
    embedVideoInEditor(gifUrl, videoUrl);
    videoInfomation = null;
})

//If User Does Not Want To Embed The Recorded Video In The Editor

$('#embedVideoNo').click(function() {
    $('#embedVideoModal').modal('hide');
    $('#videoRecorderModal').modal('hide');
    videoInfomation = null;
})

// Function To Fetch Videos From Bombbomb Server

function getVideosFromBombbomb() {

    $('#clientVideos').empty();
    bb.getVideos({}, function(data) {

        let videos = data.info;

        if (videos.length == 0) {
            $('#noVideoFound').show();
            $('#videoList').hide();
        }

        for (let i = 0; i < videos.length; i++) {

            let clientVideos = `<div class="col-12 col-sm-12 col-md-6 col-lg-4 mb-3 videoList">
            <div class="card video-card">
                <video class="video-width video-height" width="100%" height="100%" disablePictureInPicture controls controlsList="nodownload">
                    <source src="${videos[i].vidUrl}" type="video/mp4">
                </video>
                <label class="custom-checkbox mb-2 ml-2 mt-2 template-title font-14"><input type="radio" name="videoRadioBtn" videoUrl="${videos[i].vidUrl}" gifUrl="${videos[i].animatedThumbUrl}" ><span class="checkmark"></span>${videos[i].name}</label>
            </div>
         </div>`

            $('#clientVideos').append(clientVideos);

        }

    });
    $('#videosList').modal('show');
}

// Select Video To Embed In The Editor

$('#selectVideoBtn').click(function() {

    let isSelected = $("input[name='videoRadioBtn']").is(':checked');
    if (!isSelected) {
        toastr.remove();
        toastr.error(message.VIDEO_FILE);
        return
    }
    let gifUrl = $("input[name='videoRadioBtn']:checked").attr('gifUrl');
    let videoUrl = $("input[name='videoRadioBtn']:checked").attr('videoUrl');
    embedVideoInEditor(gifUrl, videoUrl);

})

// Create Element And Append The Video With Gif And Link In The Editor

function embedVideoInEditor(gifUrl, videoUrl) {

    let embedVideo = `<div><a href="${videoUrl}"><img src="${gifUrl}"></a></div>`;
    $(".Editor-editor").append(embedVideo);
    $("#videosList").modal('hide');
    $('#embedVideoModal').modal('hide');
    $('#videoRecorderModal').modal('hide');

}

function OnInvalidTokenCallback(error) {
    console.log("ERROR", error);
}