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
                        userPrimaryObj.firstName = value;
                    }
                },
                "#mobileNumber":
                {
                    bind: function (data, value) {
                        userPrimaryObj.mobileNumber = value;
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
            }
        });

    enrollmentForm.validate({
        rules: {
            personalName: { required: true },
            personalEmail: { required: true, email: true },
            mobileNumber: { required: true, number: true, minlength: 10, maxlength: 10 },
            address: { required: true },
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
                type: 'GET',
                success: function (data) {
                    console.log("lof", data);
                },
                error: function (error) {
                    console.log("errror", error);
                }
            });
            console.log("klllllllllllllllllll", sdfd);
        }
    });
})