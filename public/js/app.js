$(document).ready( function () {
  var socket = io.connect('http://localhost:3000');
  window.buttonPressed = function(e) {
    if(e.keyCode === 13) {
      $('#calculate').click();
    } else if (e.keyCode >=48 && e.keyCode<=57) {
      $('#button_' + (e.keyCode-48)).click();
    } else if (e.keyCode >=96 && e.keyCode<=105) {
      $('#button_' + (e.keyCode-96)).click();
    }
  }
  socket.on('newConnection', function (dataObj) {
    var history = dataObj.history;
    var ip = dataObj.ip;
    $('#user').text(ip);
    for (var i = 0; i < history.length; i++) {
      var  data = history[i];
      var newConnection = '<li class="text-center list-group-item"><div class="pull-left"><span class="fa fa-user"></span> ' + data.ip 
        + '</div><div class="badge" title="' + data.time + '"><span class="fa fa-clock-o"></span> ' 
        + moment(data.time, "MMMM Do YYYY, h:mm:ss a").fromNow() + '</div><hr /><div><span class="fa fa-star"></span> ' 
        + data.display + '</div></li>';
      $('#connectedUsers').prepend(newConnection);
    };
  });

  socket.on('addHistory', function (data) {
    var newConnection = '<li class="text-center list-group-item"><div class="pull-left"><span class="fa fa-user"></span> ' + data.ip 
      + '</div><div class="badge" title="' + data.time + '"><span class="fa fa-clock-o"></span> ' 
      + moment(data.time, "MMMM Do YYYY, h:mm:ss a").fromNow() + '</div><hr /><div><span class="fa fa-star"></span> ' 
      + data.display + '</div></li>';
    $('#connectedUsers').prepend(newConnection);
  });

  $('#calculate').click(function () {
    if($('#myScreen').val() != '') {
      var resString =  $('#myScreen').val();
      var displayString = resString + ' = ' + eval(resString);
      $('#myScreen').val(eval(resString));
      $('#myScreen').css('border', '1px solid #78ADFF');
      socket.emit('newCalc', { data: displayString });
    } else {
      $('#myScreen').css('border', '1px solid red');
      $('#myScreen').popover('show');
      $('#myScreen').attr('title', '')
    }
    
  });
  $('td[id^="button"]').click(function () {
    if($(this).attr('value') === 'C') {
      $('#myScreen').val('');
    } else {
      $('#myScreen').css('border', '');
      $('#myScreen').popover('hide');
      $('#myScreen').val($('#myScreen').val() + $(this).attr('value'));
    }
  });
  
});