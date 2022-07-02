
$(document).ready(function () {
    var email = localStorage.getItem('email');
    $('.generate-password').click(function () {
        $.ajax({
            url: $.COMMON_BASE_URL + "generatePassword",
            type: 'POST',
            data: {
                email: email
            },
            headers: { 'Authorization': $.getJwt() },
            dataType: "JSON",
            success: function (data) {
                toastr.remove()
                $.toast.success(data.message);
                $('.generate-password-modal').modal('toggle');
            },
            error: function (xhr) {
                toastr.remove()
                $.toast.error(xhr.responseJSON.message);
            }
        })
    })
});