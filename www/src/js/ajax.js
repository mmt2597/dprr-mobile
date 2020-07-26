function calamityLocate() {
  var link = $('#calamite').attr('data-href');
  $("#modalSearch").modal("close");
  $('ul.tabs').tabs('select_tab', 'calamities');
  $('.__card #'+ link).galleryExpand('open');
}
  
function showSearch() {
  $('#search-container').css('display', 'block');
}
function hideSearch() {
  $('#search-container').css('display', 'none');
}
function DiseasesLocate() {
      $("#modalSearch").modal("close");
      $('ul.tabs').tabs('select_tab', 'diseases');
}

function showprovinfo(id){
  $.getJSON('json/provinces.json', function(data) {
    $.each(data, function(key, val) { // index, obj
      if(val.ProvinceID == id) {
        $('#result_header').html(val.Province);
        $('#searchContent').html(val.Province_Info);
        $('#modalSearch').modal("open");
      }
    });

  })
}


function searchinvoke() {
  var srchInput = $('#searchText').val();
  if(srchInput == '') { hideSearch(); return; }

  srchInput = srchInput.replace(/ /g, '|');
  if (srchInput[srchInput.length - 1] == '|') {
    srchInput = srchInput.replace(/\|/, '');
  }
  var regex = new RegExp('(?=[^\\s])' + srchInput, 'gi');
  var sorted = '';
  var desc, catego, dataHref;
  var results = [],
  sortedResultNames = [];
  $.getJSON('json/all.json', function(data) {
    $.each(data, function(key, val) { // index, obj
                                      
      if(val.name.search(regex) != -1 || val.Category.search(regex) != -1) {
        results.push(val);
        sortedResultNames.push(val.name);
      } else {
          
      }
    });

    sortedResultNames = sortedResultNames.sort();
    $.each(sortedResultNames, function(i, nameVal) {
      $.each(results, function(key, val) {
        
        if (val.name == nameVal) {

          if(val.Category == 'Calamities') {
            catego = "calamityLocate()";
            dataHref = val.name;
            catid = "calamite";
          }
          else if(val.Category == 'Diseases') {
            catego = "DiseasesLocate()";
            dataHref = "";
            catid = "";
          }
          else if(val.Category == 'Province') {
            catego = "showprovinfo(" + val.ProvinceID + ")";
            dataHref = "";
            catid = "";
          } else {
            catego = "";
            dataHref = "";
            catid = "";
          }
          sorted += '<li class="mt-5">\
                      <h6>\
                        <a id="' + catid + '" data-href="'+ dataHref +'" onclick="' + catego + '" href="javascript:void(0);">' + val.name + '</a>\
                      </h6>';

          if(val.description != undefined) {
            if(val.description.length > 100 ) {
              desc = val.description.substring(0, 100) + "....";
            } 
          } else {
            desc = "";
          }
          sorted += '<p>' + desc + '</p></li>';
        }
      });
    });
    $('#result_header').html("SEARCH RESULTS");
    $('#searchContent').html(sorted);
    hideSearch();
    $("#modalSearch").modal("open");
  });
}

$('#searchText').keypress(function (e) { if (e.which == 13) { searchinvoke(); } });
$('#searchButton').click(searchinvoke);


  /***********************************/
 /**********  [PROVINCES]  **********/ 
/***********************************/
$(document).ready(function () {
  $.ajax({
    type: 'GET',
    url: 'json/provinces.json',
    success: function (res) {
      $.each(res, function (i, item) {
        var mod = '<div id="prov-'+ item.ProvinceID +'" class="modal">\
                      <div class="modal-content">\
                        <h4>'+ item.Province +'</h4>\
                        <p>'+ item.Province_Info +'</p>\
                      </div>\
                      <div class="modal-footer">\
                        <a href="javascript:void(0)" class="modal-action modal-close waves-effect waves-green btn-flat ">Close</a>\
                      </div>\
                    </div>';
          $('#modal-province').append(mod);
      });
    }
  });
});


  /********************************/
 /**********  [REGION]  **********/ 
/********************************/
var reg = new XMLHttpRequest();
reg.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
          var data = JSON.parse(this.responseText);

          $(data).each(function(i, val) {
               $(val).each(function(k, v) {

                var region = $('<div class="card">\
                    <div class="card-image waves-effect waves-block waves-light">\
                      <img class="activator responsive-img" src='+ v.region_dir_main +'>\
                    </div>\
                    <div class="card-content">\
                      <span class="card-title activator grey-text text-darken-4">' + v.region + '\
                         <i class="material-icons right">more_vert</i></span>\
                    </div>\
                    <div class="card-reveal">\
                      <span class="card-title grey-text text-darken-4">'+ v.region +'<i class="material-icons right">close</i></span>\
                      <p class="p-0 pt-3">Hotline Number(s)</p>\
                      <p>'+ v.region_hotline +'</p>\
                    </div>\
                  </div>');
                    $('#regions').append(region);
               });
          });
    }
};
reg.open("GET", "json/region.json", true);
reg.send();
/***************************** [END OF REGION] ***************************************/

var intervalTweets = null;
var flag;
var recentID;


function intervalManager(flag, arg, time) {
  if(navigator.onLine) {
    if(flag) {
      $('img[alt="nowifi"]').remove();
      $('.select-wrapper').css('display', 'block');
      $('ul#notif-placeholder.collection.notif-container')
      .html('<img class="responsive-img mt-5"  src="images/loading.gif" alt="loading..."><p class="center">Loading...</p>')
      intervalTweets = setInterval(arg, time);
      Materialize.toast('Connected', 5000);
    } else {
        clearInterval(intervalTweets);
        Materialize.toast('No connection', 5000);
        $(document).ready(function () {
            $('.select-wrapper').css('display', 'none');
            $('ul#notif-placeholder.collection.notif-container').html("<img style='padding: 25px 50px 50px 50px;' width='100%' src='images/no-wifi.png' alt='nowifi' />");
        });
    }
  } else if (!navigator.onLine) {
      clearInterval(intervalTweets);
      Materialize.toast('No connection', 5000);
      $(document).ready(function () {
          $('.select-wrapper').css('display', 'none');
          $('ul#notif-placeholder.collection.notif-container').html("<img style='padding: 25px 50px 50px 50px;' width='100%' src='images/no-wifi.png' alt='nowifi' />");
      });
  } else {
    alert("UNKNOWN");
  }
}


 /*******  [TWITTER-POST]  *******/ 

$("#filter-select").on("change",function(){
  $("#notif-placeholder").html('<img class="responsive-img mt-5"  src="images/loading.gif" alt="loading..."> <p>Loading...</p>');
  $("#notif-placeholder2").html('<img class="responsive-img mt-5"  src="images/loading.gif" alt="loading..."> <p>Loading...</p>');
});

function getPostTweets() {
var reg = new XMLHttpRequest();
  reg.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
          $('#dprr-alert .collection').html(this.responseText);
          check_recnt(); 
      }
  };
  reg.open("GET", "http://dprr.000webhostapp.com/dev-cca/public/get/tweets?filter_place=" + $('#filter-select').val(), true);
  reg.send();
}




// window.addEventListener('online', intervalManager(true, getPostTweets, 5000));

  var testcon = intervalManager(true, getPostTweets, 5000) || function() { intervalManager(true, getPostTweets, 5000); }
  window.addEventListener('online', testcon, false);
  window.addEventListener('offline', function() { intervalManager(false) }, false);



/***************************** [END OF TWITTER-POST] ***************************************/



  /**************************************/
 /*******  [TWITTER-POST-MODAL]  *******/ 
/**************************************/
var twit = new XMLHttpRequest();
var httpRecent = new XMLHttpRequest();

// twit.onreadystatechange = function() {
//      if (this.readyState == 4 && this.status == 200) {
//        recentID = this.responseText;
//     }
// };

// twit.open("GET", "http://dprr.000webhostapp.com/dev-cca/public/get/recent", true);
// twit.send();

function check_recnt(){  
  httpRecent.open("GET","http://dprr.000webhostapp.com/dev-cca/public/get/recentNotications");
  httpRecent.send();
}

function showProvInfo (id) {
  $('.modal').modal();
  $('#prov-' + id).modal('open');
}

function showmod(){
  $("#myModal").modal('open');
}
  
httpRecent.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {  
    JSONnotif = JSON.parse(this.responseText);
    if(JSONnotif.id != recentID){
      recentID = JSONnotif.id;
      var link = JSONnotif.msg.match(/\bhttps?:\/\/\S+/gi);
      var addedlink = '<a href="'+link+'">'+link+'</a>';
      $("#notif_body").html(JSONnotif.msg.replace(/\n\r?/g, '<br />').replace( /(https:\/\/[^\s]+)/gi ,  addedlink));
      showmod();
    }
  }
};


// EVALUATION

function _evaluate() {
  
  if($('input[name=ques1]').is(':checked') && $('input[name=ques2]').is(':checked') &&
     $('input[name=ques3]').is(':checked') && $('input[name=ques4]').is(':checked') &&
     $('input[name=ques5]').is(':checked') && $('input[name=ques6]').is(':checked') &&
     $('input[name=ques7]').is(':checked') && $('input[name=ques8]').is(':checked') &&
     $('input[name=ques9]').is(':checked') && $('input[name=ques10]').is(':checked') &&
     $('input[name=ques11]').is(':checked') && $('input[name=ques12]').is(':checked') &&
     $('input[name=ques13]').is(':checked') && $('input[name=ques14]').is(':checked') &&
     $('input[name=ques15]').is(':checked')) { 

    $.ajax({
      type: 'POST',
      crossDomain: true,
      url: 'http://dprr.000webhostapp.com/dev-cca/public/eval.php?' + $('#evaluateForm').serialize(),
      success: function (data, textStatus, jqXHR) {
        alert('Evaluating Completed');
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert('Evaluating Error: ' + textStatus);
      }
    });

  } else {
    alert("Please answer all the question");
  }  
}
