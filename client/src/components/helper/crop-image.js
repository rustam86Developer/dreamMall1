var cropMaxWidth = 400;
var cropMaxHeight = 400;
var jcropApi;
var image;
var prefsize;
var canvas;
var context;
var imageType

function loadImage(input) {
    $(".cropbutton").show();
    $(".cropbutton1").show();
    $(".rotatebutton").show();
    $(".hflipbutton").show();
    $(".vflipbutton").show();

    $("#uploadLogo").hide();
    $("#uploadProfilePic").hide();


    if (input.files && input.files[0]) {
        var reader = new FileReader();
        canvas = null;
        reader.onload = function(e) {
            image = new Image();
            image.onload = validateImage;
            image.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}


function validateImage() {
    if (imageType == 'logo') {
        $('#uploadLogoModal').modal('show')
    }
    if (imageType == 'profile') {
        $('#uploadProfileModal').modal('show')
    }
    setTimeout(() => {
        if (canvas != null) {

            image = new Image();
            image.onload = restartJcrop
            image.src = canvas.toDataURL('image/png');

        } else {
            restartJcrop();
        }
    }, 500);
}

function restartJcrop() {
    if (jcropApi != null) {
        jcropApi.destroy();
    }
    if (imageType == 'logo') {
        $("#displayImageOnPopup").empty();
        $("#displayImageOnPopup").append("<canvas id=\"canvas" + imageType + "\">");
    }
    if (imageType == 'profile') {
        $("#displayProfileOnPopup").empty();
        $("#displayProfileOnPopup").append("<canvas id=\"canvas" + imageType + "\">");
    }

    canvas = $("#canvas" + imageType)[0];

    context = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    $("#canvas" + imageType).Jcrop({
        onSelect: selectcanvas,
        onRelease: clearcanvas,
        boxWidth: cropMaxWidth,
        boxHeight: cropMaxHeight,
    }, function() {
        jcropApi = this;
    });

    clearcanvas();
}

function clearcanvas() {
    prefsize = {
        x: 0,
        y: 0,
        w: canvas.width,
        h: canvas.height,
    };
}


function selectcanvas(coords) {
    prefsize = {
        x: Math.round(coords.x),
        y: Math.round(coords.y),
        w: Math.round(coords.w),
        h: Math.round(coords.h)
    };
}

function applyCrop() {

    canvas.width = prefsize.w;
    canvas.height = prefsize.h;
    context.drawImage(image, prefsize.x, prefsize.y, prefsize.w, prefsize.h, 0, 0, canvas.width, canvas.height);
    validateImage();
}

function applyRotate() {
    canvas.width = image.height;
    canvas.height = image.width;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.translate(image.height / 2, image.width / 2);
    context.rotate(Math.PI / 2);
    context.drawImage(image, -image.width / 2, -image.height / 2);

    validateImage();
}


function applyHflip() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.translate(image.width, 0);
    context.scale(-1, 1);
    context.drawImage(image, 0, 0);
    validateImage();
}

function applyVflip() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.translate(0, image.height);
    context.scale(1, -1);
    context.drawImage(image, 0, 0);
    validateImage();
}

function charge() {
    document.body.onfocus = roar
}

function roar() {
    document.body.onfocus = null
}
$(".cropbutton").click(function(e) {
    applyCrop();
});


$(".rotatebutton").click(function(e) {
    applyRotate();
});


$(".hflipbutton").click(function(e) {
    applyHflip();
});

$(".vflipbutton").click(function(e) {
    applyVflip();
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            image = new Image();
            image.onload = drawImage;
            image.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }

}


function drawImage() {

    $("#canvasDiv").empty();
    $("#canvasDiv").append("<canvas id='canvas' >");
    let canvas = $("#canvas")[0];
    $.canvas = canvas;
    let context = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 400;
    // get the scale
    var scale = Math.min(canvas.width / image.width, canvas.height / image.height);
    // get the top left position of the image
    var x = (canvas.width / 2) - (image.width / 2) * scale;
    var y = (canvas.height / 2) - (image.height / 2) * scale;
    context.drawImage(image, x, y, image.width * scale, image.height * scale);

    //context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height)

    setTimeout(() => {
        jCrop = $('#canvas').Jcrop({
            aspectRatio: 1,
            setSelect: [65, 70, 330, 200],
            onSelect: updatePreview,
            bgOpacity: .4,

        });
    }, 1000);


}

function updatePreview(c) {
    $.croppedImageData = c;
    $.canvasElement = $("#canvas")[0];

}

function dataURLtoBlob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);

        return new Blob([raw], {
            type: contentType
        });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {
        type: contentType
    });
}