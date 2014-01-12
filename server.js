"use strict";
var App = require('./app.js');
var http = require('http');
var mongo = require('mongoose');
var dbhost = process.env.TODO_DBHOST || 'localhost'; 
var dbname = process.env.TODO_DBNAME || 'todo';

mongo.connect('mongodb://' + dbhost + '/' + dbname);
mongo.connection.on('open', function(){
  var app = new App(mongo.connection); 
  var server = http.createServer(app);
  server.listen(app.get('port'));
  console.log('server listening on port ' + app.get('port'));
});
mongo.connection.on('error', function() {
  console.log('Error connecting to the application');
});

