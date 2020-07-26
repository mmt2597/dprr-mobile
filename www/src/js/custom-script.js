function logout () {
  $('#load-dashboard').css('display', 'none');
  $('#hide-when-login').css('display', 'block');
  $('#evaluate-btn').attr('disabled', 'true');
  $('#evaluate-btn').html("You need to login first");
}

function toastmsg(msg) { Materialize.toast(msg, 4000); }

function checkConfirmation(res) {
  var recaI = $('#reca i');
  if(res.data.confirmation == 'unconfirmed') {
      $('#msg-notif').css({
        display: 'block',
        background: '#756d6d',
        color: '#fff',
        padding: '10px',
        fontSize: '12px'
      });
    
      $('#msg-notif').html('Please verify your email <a href="javsacript:void(0);">' + res.data.email + "</a>");
      $('#evaluate-btn').attr('disabled', 'true');
      $('#evaluate-btn').html("Please verify your email");
    
  } else {
    $('#evaluate-btn').removeAttr('disabled');
      $('#evaluate-btn').html("Submit");
  }
}


$(document).ready(function() {

    $('#dprr-alert').append();

    $(".gallery-curve-wrapper").on("click", function() {
      $('.flexslider').flexslider({
          start: function (slider) {
            $('.flexslider').css("display", "block");
          },
          animationLoop: true,
          controlNav: true,
          touch: true,
          keyboard: true,
          slideshow: true
      });
    });

    $('.modal').modal();
    $(".button-collapse").sideNav({
      menuWidth: 250,
      draggable: true
    });

    $('ul#slide-out li a').click(function() {
        $(".button-collapse").sideNav('hide');
    });



    

    /* ACCOUNT */

    $('#btn-register-show').click(function (e) {
        e.preventDefault();
        $('#login-board').css('display', 'none');
        $('#register-board').css('display', 'block');
    });

    $('#btn-login-show').click(function (e) {
        e.preventDefault();
        $('#register-board').css('display', 'none');
        $('#login-board').css('display', 'block');
    });



    /* LOGIN */
    $('#login-btn').click(function (e) {
        e.preventDefault();

        var loginForm = $('#login-form').serialize();
        $.ajax({
            url: 'https://dprr.000webhostapp.com/includes/login.php',
            data: loginForm,
            success: function (response) {
              var data = JSON.parse(response);

                if(data.status == 'ok') {
                    toastmsg(data.result);
                    $('#hide-when-login').css('display', 'none');
                    $('#load-dashboard').css('display', 'block');
                    $('#load-dashboard').load('src/dashboard.html', function () {
                        $('#email-dash').html(data.data.email);
                        checkConfirmation(data);
                    });
                } else { 
                    toastmsg(data.result); return; 
                  } 
            }
        });
    });


    /* REGISTER */
    $('#register-btn').click(function (e) {
        e.preventDefault();

        var regForm = $('#register-form').serialize();
        var pass = $('#pswrd').val();
        var repass = $('#repassword').val();
        
       if(pass == repass) {
            $.ajax({
              url: 'https://dprr.000webhostapp.com/includes/register.php',
              type: 'post',
              data: regForm,
              success: function (data) {
                  var msg = JSON.parse(data);
                  toastmsg(msg.result);
              } 
            });
       
       } else {
          toastmsg("Password didn't match");
       }

    });
});



// function exitAppPopup() {
//     navigator.notification.confirm("Do you really want to close this app?", ConfirmExit, "Confirmation", "Yes,No"); 
//     alert("Outside Notification"); 
//     return false;
// }

function ConfirmExit(stat) {
    if(stat == true){
        navigator.app.exitApp();
    }else{
        return;
    }
}

function deviceisready() {
    document.addEventListener("backbutton", function(e){
      var conf = confirm("Do you really want to close this app?");
      ConfirmExit(conf);
    });
}



document.addEventListener("deviceready", deviceisready, true);

$(document).ready(function () {
  $('#filter-select').material_select();
})

