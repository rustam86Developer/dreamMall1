// clientId = localStorage.getItem('clientId');
var clientInfo = {}

$(document).ready(function () {
   
    $('.minus').click(function () {
        var $input = $(this).parent().find('input');
        var count = parseInt($input.val()) - 1;
        count = count < 1 ? 1 : count;
        $input.val(count);
        $input.change();
        return false;
    });
    $('.plus').click(function () {
        var $input = $(this).parent().find('input');
        $input.val(parseInt($input.val()) + 1);
        $input.change();
        return false;
    });

    // setInterval(() => {
        
    // console.log("3333333tiem");
    // }, 3000);
});

function getNumberOfChild() {
    console.log("yessssssssssssssssssssssssssUrl");
}
// getNumberOfChild();

$('#bitBtn').click( async () => {
    let totalval = $('#totalValue').val();
    let sdfd = $.ajax({
        url: 'http://localhost:8000/place-bit',
        data: totalval,
        headers: {
            'content-type': 'application/json',
        },
        type: 'GET',
        success: function (data) {
            console.log("lof", data);
            $('#enrollmentForm').trigger("reset");
            toastr.remove();
            $.toast.success('Bit Has Been Successfully Placed');
        },
        error: function (error) {
            console.log("errror", error);
            toastr.remove();
            $.toast.error('Please try after half an hour');
        }
    });
})
