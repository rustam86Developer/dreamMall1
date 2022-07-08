
$.PAYMENT_TYPE = paymentType.CARD

/**
 * Set Payment Type i.e `ACH` and `CARD`.  
 */  
$('#creditType').click(function () {
    $('#creditCardFields').show();
    $('#AchFields').hide();
    $('#creditType').addClass('select-button-active');
    $('#AchType').removeClass('select-button-active');
    $.PAYMENT_TYPE = paymentType.CARD
  

})
$('#AchType').click(function () {
    
    $('#creditCardFields').hide();
    $('#AchFields').show();
    $('#AchType').addClass('select-button-active');
    $('#creditType').removeClass('select-button-active');
    $.PAYMENT_TYPE = paymentType.ACH;
   
})

/**************checked same as previous************************ */
$('#billingSameAsPrevious').click(function () {
    if ($(this).prop("checked") == true) {
       
        $('#billingAddressDiv :input').attr('disabled', true);
        $.SAME_AS_PREVIOUS = true;
       
    }
    else if ($(this).prop("checked") == false) {
        $('#billingAddressDiv :input').attr('disabled', false);
        $.SAME_AS_PREVIOUS= false;
        
       
    }

})


$("#creditCardNumber").on('input', function () {
    creditCardType = detectCardType($(this).val())
})







$('#creditCardNumber').blur(function () {
    let cardNumber = $('#creditCardNumber').val();
    let cardType = detectCardType(cardNumber);
    $.CARD_TYPE = cardType

})
 
 
 
 
 
 /**detect the all type of card*/


 
  
 function detectCardType(number) {
    /** visa*/

  var re = new RegExp("^4");
  if (number.match(re) != null)
      return "Visa";

  /** Mastercard */
  /** Updated for Mastercard 2017 BINs expansion*/

  if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number))
      return "Mastercard";
  /** AMEX */

  re = new RegExp("^3[47]");
  if (number.match(re) != null)
      return "AMEX";
   /**Discover */

  re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
  if (number.match(re) != null)
      return "Discover";
  /**Diners */
  
  re = new RegExp("^36");
  if (number.match(re) != null)
      return "Diners";
  /**Diners - Carte Blanche*/

  re = new RegExp("^30[0-5]");
  if (number.match(re) != null)
      return "Diners - Carte Blanche";
  /**JCB*/

  re = new RegExp("^35(2[89]|[3-8][0-9])");
  if (number.match(re) != null)
      return "JCB";
  /**Visa Electron*/
 
  re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
  if (number.match(re) != null)
      return "Visa Electron";

  return null;
}