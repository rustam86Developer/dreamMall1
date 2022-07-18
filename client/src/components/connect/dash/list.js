$(document).ready(function() {
    console.log("3333333333333");
    var options = {
        "key": "rzp_test_fiIwmRET6CApc2",
        "amount": "49900",
        "currency": "INR",
        "name": "Dummy Academy",
        "description": "Pay & Checkout this Course, Upgrade your DSA Skill",
            "image": "https://media.geeksforgeeks.org/wp-content/uploads/20210806114908/dummy-200x200.png",
        "order_id": "order_HdPuQW0s9hY9AU",
        "handler": function (response){
            console.log("response",response)
            alert("This step of Payment Succeeded");
        },
        "prefill": {
            //Here we are prefilling random contact
            "contact":"9876543210",
            //name and email id, so while checkout
            "name": "Twinkle Sharma",
            "email": "smtwinkle@gmail.com"
        },
        "notes" : {
            "description":"Best Course for SDE placements",
            "language":"Available in 4 major Languages JAVA,C/C++, Python, Javascript",
            "access":"This course have Lifetime Access"
        },
        "theme": {
            "color": "#2300a3"
        }
    };
    var razorpayObject = new Razorpay(options);
    console.log("razorpayObject===",razorpayObject);
    razorpayObject.on('payment.failed', function (response){
            console.log("error===========",response);
            alert("This step of Payment Failed");
    });
        
    document.getElementById('pay-button').onclick = function(e){
        console.log("clicked==========");
        razorpayObject.open();
        e.preventDefault();
    }
    // var objInterval = null;
    // let clientId = localStorage.getItem('clientId');
    // // 
    // $.CLIENT_ID = clientId;
    // $('#fileUploadCorrectBtn').show();
    // // $(document).ready(function() {
    //     // Toggle plus minus icon on show hide of collapse element
    //     $(".collapse").on('show.bs.collapse', function(event) {
    //       $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus").addClass("fas");
    //       event.stopPropagation();
    //     }).on('hide.bs.collapse', function(event) {
    //       $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus").addClass("fas");
    //       event.stopPropagation();
    //     });
    // //   });
})
date = new Date();
var currentDate = moment().format('YYYY-MM-DD');
console.log("3333333333",currentDate);
function countDown(){
    var timer2 = "03:00";
    var interval = setInterval(function() {
        var timer = timer2.split(':');
        var minutes = parseInt(timer[0], 10);
        var seconds = parseInt(timer[1], 10);
        if(minutes == 0 && seconds == 0){
            timer2 = "03:00";
            timer = timer2.split(':');
            minutes = parseInt(timer[0], 10);
            seconds = parseInt(timer[1], 10);
        }
        --seconds;
        minutes = (seconds < 0) ? --minutes : minutes;
        minutes =  "0" + minutes;
        if (minutes < 0) clearInterval(interval);
        seconds = (seconds < 0) ? 59 : seconds;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        $('#countDown').html(minutes + ':' + seconds);
        timer2 = minutes + ':' + seconds;
    }, 900);
    console.log("444444444444",interval);
}
