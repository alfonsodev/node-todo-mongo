'use strict';
var express = require('express');

var Todo = function(db, urlPrefix) {
  this.app = express();
  this.get = function(req, res) {
    var id = req.params.id;
    db.get(id).then(function(tasks) {
      res.send(JSON.stringify(tasks), 200);
    }, function(err) {
      res.send(500, {error: 'Error whilte obtaining the task list'});
    }).done();
  };

  this.del = function(req, res) {
    var id = req.params.id;
    db.del(id).then(function(task) {
      res.send(JSON.stringify(task), 200);
    }, function(error) {
      res.send(500, { error: 'Error while deleting a task' });
    });
  };

  this.post = function(req, res) {
    var newTask = req.rawBody;
    db.add(newTask).then(function(newTask) {
      res.send(JSON.stringify(newTask));
    }, function(error) {
      res.send('{"error": "Error inserting new task"}', 500);
    }).done();
  };

  this.put = function(req, res) {
    res.send('not implemented yet');
  };

  this.app.get(urlPrefix + 'user/:id', this.get);
  this.app.post(urlPrefix + 'todo', this.post);
  this.app.del(urlPrefix + 'todo/:id', this.del);
  this.app.put(urlPrefix + 'todo/:id', this.put);

};

Todo.prototype.getApp = function() {
  return this.app;
};

module.exports = Todo;
module.exports.db = require('./db');
