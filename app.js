"use strict";
var express = require('express');
var Todo = require('./lib/Todo');
var Tododb = require('./lib/Todo').db;
var debug = require('debug')('todo');

module.exports = function(connection) {
  var tododb = new Tododb(connection);
  var todo = new Todo(tododb, '/');
  var app = express(); 
  app.set('port', process.env.TODO_PORT || 3000); 
  app.use(express.bodyParser());
  app.use(function(req, res, next) {
    debug(req.method + ':' + req.url);
    if(req.headers['session-id'] != 123)
      res.send('{"error": "Unauthorized request" }', 500);
    else
      next();
  });
  
  app.use(function(req, res, next) {
    if(/POST|PUT/.test(req.method)) {
      req.rawBody = '';
      req.setEncoding('utf8');
      req.on('data', function(chunk) { 
        req.rawBody += chunk;
      });
      req.on('end', function() {
        try {
          req.rawBody = JSON.parse(req.rawBody); 
        } catch(e) {
          res.send('{"error": "invalid JSON"', 500);
        }
    });
    } else {
      next();
    }
  });

  app.use(todo.getApp());

  return app;
};
