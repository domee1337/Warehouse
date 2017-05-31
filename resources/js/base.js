Date.prototype.toW3CString = function () {
    var year = this.getFullYear();
    var month = this.getMonth();
    month ++;
    if (month < 10) {
        month = '0' + month;
    }
    var day = this.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    var hours = this.getHours();
    if (hours < 10) {
        hours = '0' + hours;
    }
    var minutes = this.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    var seconds = this.getSeconds();
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    var offset = -this.getTimezoneOffset();
    var offsetHours = Math.abs(Math.floor(offset / 60));
    var offsetMinutes = Math.abs(offset) - offsetHours * 60;
    if (offsetHours < 10) {
        offsetHours = '0' + offsetHours;
    }
    if (offsetMinutes < 10) {
        offsetMinutes = '0' + offsetMinutes;
    }
    var offsetSign = '+';
    if (offset < 0) {
        offsetSign = '-';
    }
    return year + '-' + month + '-' + day +
        'T' + hours + ':' + minutes + ':' + seconds +
        offsetSign + offsetHours + ':' + offsetMinutes;
};



var variationId;

function findVariant(barcode)
{
  $('#load').show();
  $('.findArticle').prop("disabled", true);
  $.ajax({
        type: "GET",
        url: "/rest/items/variations",
        headers: {
    			"Authorization": "Bearer "+localStorage.getItem("accessToken")
    		},
        data: {barcode: barcode},
        success: function(data)
        {
            variationId = 0;
            var items = 0;
            var used;
            $('#output').html("");
            if(data.totalsCount == 0)
            {
              $('#output').html("<p class='find-false'>Es wurde keine Artikel gefunden.</p>");
              $('.findArticle').removeAttr("disabled");
            }
            else
            {
              //Wenn nur ein Artikel gefunden wurde
              data.entries.forEach( function(variant){
                items++;
                used = variant.id;
                number = variant.number;
                $('#output').append("<div class='find-true'><p>Artikel <span id='variant_"+variant.id+"' class='number'>"+variant.number+
                "</span> wurde gefunden. </p><input type='button' variant='"+variant.id+"' class='use_variant btn' value='Ok' onclick='usevariant("+variant.id+");'></div>");
              });

              if(items == 1)
              {
                variationId = used;
                $('#output').html("<div class='find-true'><p>Artikel <span id='variant_"+used+"' class='number'>"+number+
                "</span> wurde ausgewählt</p></div>");

                $('.use_variant').remove();
                $('.locationEan').removeAttr("disabled");
                menge();
              }
            }
            $('#load').hide();


        },
        error: function(data)
        {
            console.log(data);
            $('#load').hide();
            $('.findArticle').removeAttr("disabled");
        }
    });
}

function login()
{
  $('#load').show();
  var username = $('#username').val();
  var password = $('#password').val();
  $.ajax({
        type: "POST",
        url: "/rest/login",
        data: {username: username, password: password},
        success: function(data)
        {
            localStorage.setItem("accessToken", data.accessToken)
            $('#login').hide();
            $('#load').hide();
        },
        error: function(data)
        {
            alert("Benutername oder Passwort falsch!");
            $('#username').val("");
            $('#password').val("");
            $('#load').hide();
        }
    });


}

function menge()
{
  $('.back').removeAttr("disabled");
  if($("#standart_menge").is(':checked'))
  {
    $('.locationEan').removeAttr("disabled");
    $('.locationEan').select();
  }
  else {
    $('.locationEan').removeAttr("disabled");
    $('#menge').val("1");
    $('#menge').select();
  }
}

function checkaccess()
{

  $.ajax({
        type: "GET",
        url: "/rest/authorized_user",
        headers: {
    			"Authorization": "Bearer "+localStorage.getItem("accessToken")
    		},
        error: function(data)
        {
          $('#username').val("");
          $('#password').val("")
          $('#login').show();
          $('#username').focus();
        }
    });
  //LOGIN SELBER ERMÖGLICHEN UND DIE ROUTE /rest/authorized_user BEKOMMEN
}

function usevariant(id)
{
    var number = $("#variant_"+id).text();
    $('#output').html("<div class='find-true'>Artikel <span class='number'>"+number+"</span> wurde ausgewählt</div>");
    variationId = id;
    menge();
}

function einbuchen()
{
  $('#load').show();
  var locationean = $('.locationEan').val();
  var x = locationean.split("L");
  var error = 0;
  if (typeof x[1] != 'undefined')
  {
    var xx = x[1].split("S");
  }
  else {
    var x = locationean.split("l");
    if (typeof x[1] != 'undefined')
    {
      var xx = x[1].split("s");
    }
    else {
      error = 1;
    }
  }

  if(error === 0)
  {
    var lager = xx[0];
    //TODO die Lager checkboxen beachten
    var location = xx[1];
    console.log(lager);
    console.log(location);
    var qty = $('#menge').val();
    var date = new Date();
    date = date.toW3CString();
    console.log(date);
    //date = "2017-05-15T03:30:29-04:00";
    var url = "/rest/stockmanagement/warehouses/"+
            lager+"/stock/bookIncomingItems";

    console.log(url);
    $.ajax({
          type: "PUT",
          url: url,
          headers: {
      			"Authorization": "Bearer "+localStorage.getItem("accessToken")
      		},
          data: { incomingItems: [
            {
                variationId: variationId,
                currency: "EUR",
                reasonId: 101,
                quantity: qty,
                storageLocationId: location,
                deliveredAt: date
            }
          ]},
          success: function(data)
          {
            $('#load').hide();
            $('#output').html("<div class='green'><p>Artikel wurde erfolgreich eingebucht</p></div>");
            $('.locationEan').prop("disabled", true);
            $('.locationEan').val("");
            $('.findArticle').removeAttr("disabled");
            $('.findArticle').select();
          },
          error: function(data)
          {
            $('#load').hide();
            console.log(data);
            alert("EIN UNBEKANNTER FEHLER IST AUFGETRETEN");
          }
      });
  }
  else {
    $('#output').html("<div class='find-false'><p>Bitte überprüfen Sie Ihre eingabe!</p></div>");
    $('#load').hide();
    $('.locationEan').select();
  }
}
$(document).ready(function(){
  checkaccess();




  $('#submit').click( function(){
    login();
  });

  $('#username').bind("keydown", function(e)
  {
    if(e.keyCode === 13)
    {
      login();
    }
  });

  $('#password').bind("keydown", function(e)
  {
    if(e.keyCode === 13)
    {
      login();
    }
  });
  $('#menge').bind("keydown", function(e)
  {
    if(e.keyCode === 13)
    {
      $('.locationEan').focus();
    }
  });
  $('.back').click( function(){
    $(this).prop("disabled", true);
    $('#output').html("");
    $('.locationEan').val("");
    $('.findArticle').val("");
    $('.locationEan').prop("disabled", true);
    $('.findArticle').removeAttr("disabled");
    $('.findArticle').focus();
  });

  $('.locationEan').bind("keydown", function(e)
  {
    if(e.keyCode === 13)
    {
      einbuchen();
    }
  });
});
