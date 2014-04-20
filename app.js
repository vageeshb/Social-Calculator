'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var moment = require('moment');

var app = require('express')(),
server = require('http').createServer(app),
io = require('socket.io').listen(server);

server.listen(3000);

// APP CONFIG
app.configure( function() {

  // VIEWS FOLDER and TEMPLATING ENGINE
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // MIDDLEWARE
  app.use(express.logger());                                  // Logging server requests
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public/')); // Server stylesheets
  app.use(app.router);                                        // Router to handle routes

});

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('*', function(req, res) {
  res.render('index');
});

var allClients = [];

var history = [];

// SOCKETS.IO FUNCTIONS
io.sockets.on('connection', function (socket) {
  allClients.push(socket);
  
  var addressObj = socket.handshake.address;

  socket.emit('newConnection', {
    history: history,
    ip: addressObj.address + ":" + addressObj.port
  });

  socket.on('newCalc', function (message) {
    var addressObj = socket.handshake.address;

    history.push({
      display: message.data,
      ip: addressObj.address + ":" + addressObj.port,
      time: moment().format('MMMM Do YYYY, h:mm:ss a')
    });
    io.sockets.emit('addHistory', {
      display: message.data,
      ip: addressObj.address + ":" + addressObj.port,
      time: moment().format('MMMM Do YYYY, h:mm:ss a')
    });
  });

  socket.on('disconnect', function() {
    var i = allClients.indexOf(socket);
    var addressObj = allClients[i].handshake.address;
    console.log(addressObj.address + ':' + addressObj.port + ' : Got disconnected!');
  });
});