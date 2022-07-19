$(document).ready(function () {
    // <script type="text/javascript" src="lib/axios.js"></script>

    let userPrimaryObj = {};
    let loginForm = $("#loginForm");
    // let validate;
    loginForm.my(
        {
            ui: {
                "#password":
                {
                    bind: function (data, value) {
                        userPrimaryObj.password = value;
                    }
                },
                "#mobileNumberEmail":
                {
                    bind: function (data, value) {
                        userPrimaryObj.mobileNumberEmail = value;
                    }
                },
              
            }
        });

    loginForm.validate({
        rules: {
            password: { required: true, minlength: 6, maxlength: 16 },
            mobileNumberEmail: { required: true},
        },
        // messages: {
        //     mobileNumberEmail: 'Please fill mandatory fields',
        // },
        errorClass: "invalid-field",
        errorElement: "span",
        // highlight: function (element, errorClass) { $(element).removeClass(errorClass) },
        submitHandler: function () {
            console.log("kkkkkkkkkkkkkkkkkkkkkkkkk", userPrimaryObj);
            // return
            let sdfd = $.ajax({
                url: 'http://localhost:8000/login',
                data: userPrimaryObj,
                headers: {
                    'content-type': 'application/json',
                  },
                type: 'GET',
                success: function (data) {
                    data = data.data;
                    console.log("lof", data);
                    $('#loginForm').trigger("reset");
                    console.log("777777777",data.length);
                    if(data.length){
                        console.log("333333333",data[0].password == userPrimaryObj.password && (userPrimaryObj.mobileNumberEmail == data[0].mobile || userPrimaryObj.mobileNumberEmail == data[0].email));
                        if(data[0].password == userPrimaryObj.password && (userPrimaryObj.mobileNumberEmail == data[0].mobile || userPrimaryObj.mobileNumberEmail == data[0].email)){
                            toastr.remove();
                            $.toast.success('Login Successfully');
                            let redirectUrl = '/gotoplay';
                            window.location = redirectUrl;
                        }else{
                            toastr.remove();
                            $.toast.error("Oops!!, Password Didn't match");
                        }
                    }else{
                        toastr.remove();
                        $.toast.error("Oops!!, User Not Found");
                    }
                },
                error: function (error) {
                    console.log("errror", error);
                    toastr.remove();
                    $.toast.error('Please try after half an hour');
                }
            });
            console.log("klllllllllllll", sdfd);
        }
    });
})