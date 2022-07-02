$.fn.showMiniLoader = function (text) {
    $(this).empty();
    $(this).attr('disabled', '');
    $(this).parent().addClass('submit-loader')
    $(this).append('<div class="loader"></div>' + text)
}


$.fn.hideMiniLoader = function (text) {
    $(this).empty();
    $(this).removeAttr('disabled');
    $(this).parent().removeClass('submit-loader')
    $(this).append(text)
}
$.fn.disableButton = function () {

    $(this).attr('disabled', '');
    $(this).addClass("disable");
  
}
$.fn.areaLoader = function (show) {
    $('.lds-ring').remove()
    show ? $(this).append('<div class="lds-ring"><div></div><div></div><div></div><div></div></div>') : $('.lds-ring').remove()
}