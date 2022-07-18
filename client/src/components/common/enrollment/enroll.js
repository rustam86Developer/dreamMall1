$(document).ready(function () {
    // <script type="text/javascript" src="lib/axios.js"></script>

    let userPrimaryObj = {};
    let enrollmentForm = $("#enrollmentForm");
    // let validate;
    enrollmentForm.my(
        {
            ui: {
                "#personalName": {
                    bind: function (data, value) {
                        userPrimaryObj.name = value;
                    }
                },
                "#mobileNumber":
                {
                    bind: function (data, value) {
                        userPrimaryObj.mobile = value;
                    }
                },
                "#personalEmail":
                {
                    bind: function (data, value) {
                        userPrimaryObj.email = value;
                    }
                },
                "#address":
                {
                    bind: function (data, value) {
                        userPrimaryObj.address = value;
                    }
                },
                "#password":
                {
                    bind: function (data, value) {
                        userPrimaryObj.password = value;
                    }
                },
            }
        });

    enrollmentForm.validate({
        rules: {
            personalName: { required: true },
            personalEmail: { required: true, email: true },
            mobileNumber: { required: true, number: true, minlength: 10, maxlength: 10 },
            address: { required: true },
            password: { required: true },
        },
        // messages: {
        //     personalName: 'Please fill mandatory fields',
        //     personalEmail: 'Please fill mandatory fields',
        //     mobileNumber: 'Please fill mandatory fields',
        //     address: 'Please fill mandatory fields',
        // },
        errorClass: "invalid-field",
        errorElement: "span",
        // highlight: function (element, errorClass) { $(element).removeClass(errorClass) },
        submitHandler: function () {
            console.log("kkkkkkkkkkkkkkkkkkkkkkkkk", userPrimaryObj);
            // console.log("kkkkkkkkkkkkkkkkkkkkkkkkk", $.getJwt());
            // $('div.setup-panel div a[href="#step-1"]').parent().next().children("a").trigger('click') 
            // jQuery('html,body').animate({ scrollTop: 0 }, 0);
            let sdfd = $.ajax({
                url: 'http://localhost:8000/enroll-ment',
                data: userPrimaryObj,
                headers: {
                    'content-type': 'application/json',
                  },
                type: 'GET',
                success: function (data) {
                    console.log("lof", data);
                    $('#enrollmentForm').trigger("reset");
                    toastr.remove();
                    $.toast.success('Registration Has Been Successfully');
                },
                error: function (error) {
                    console.log("errror", error);
                    toastr.remove();
                    $.toast.error('Please try after half an hour');
                }
            });
            console.log("klllllllllllllllllll", sdfd);
        }
    });
})