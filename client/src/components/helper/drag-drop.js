
// Drag and Drop [Can be common for all]
$(function () {
    // preventing page from redirecting
    $("html").on("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".uploadText").text("Drag here");
    });
    $("html").on("drop", function (e) { e.preventDefault(); e.stopPropagation(); });

    // Drag enter
    $('.upload-area').on('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(".uploadText").text("Drop");
    });
    // Drag over
    $('.upload-area').on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(".uploadText").text("Drop");
    });

    // Drop
    $('.upload-area').on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();

        let acceptable = $.FILE_ACCEPT;

        $(".uploadText").text("Drag and drop file here OR click to select file");

        file = e.originalEvent.dataTransfer.files[0];

        if (file.size > $.FILE_SIZE) {
            toastr.error("File size too large");
            return
        }

        if (!acceptable.includes(file.name.split('.')[1])) {
            toastr.error("File not accepted");
            return;
        }
        $('.onFileUpload').show();
        $('.uploadedFileName').text(file.name);
    });

    

    $("html").on("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".uploadText").text("Drag here");
    });
    $("html").on("drop", function (e) { e.preventDefault(); e.stopPropagation(); });

    // Drag enter
    $('.upload-file-area').on('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(".uploadText").text("Drop");
    });
    // Drag over
    $('.upload-file-area').on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(".uploadText").text("Drop");
    });

    // Drop
    $('.upload-file-area').on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();

        let acceptable = $.FILE_ACCEPT;

        $(".uploadText").text("Drag and drop file here OR click to select file");

        file = e.originalEvent.dataTransfer.files[0];

        if (file.size > $.FILE_SIZE) {
            toastr.error("File size too large");
            return
        }

        if (!acceptable.includes(file.name.split('.')[1])) {
            toastr.error("File not accepted");
            return;
        }
        $('.onFileUpload').show();
        $('.uploadedFileName').text(file.name);
    });

});