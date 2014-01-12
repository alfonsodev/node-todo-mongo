'use strict';
var q = require('q');
var mongo = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var debug = require('debug')('todo-db');

var Todo = function(conn) {
  this.conn = conn;
  this.coll = conn.collection('tasks');
  this.Task = require('./model.js');
};

Todo.prototype.get = function(id) {
  var deferred = q.defer();
  var query = id ? {user_id: parseInt(id, 10)} : {};
  this.coll.find(query).toArray(function(err, result) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(result);
    }
  });
  return deferred.promise;
};

Todo.prototype.add = function(taskDoc) {
  var deferred = q.defer();
  try {
    var task = new this.Task(taskDoc);
    task.save(function(err, result) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(result);
      }
    });
    return deferred.promise;
  } catch (e) {
    deferred.reject(e);
    return deferred.promise;
  }
};

Todo.prototype.del = function(id) {
  var deferred = q.defer();
  try {
    this.Task.remove({ _id: new ObjectId(id)}, function(err, task) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve('ok');
      }
    });
    return deferred.promise;
  } catch (e) {
    deferred.reject(e);
    return deferred.promise;
  }
};

Todo.prototype.update = function(id) {
  var deferred = q.defer();
  this.Task.update({ _id: new ObjectId(id)}, function(err, task) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(task);
    }
  });
};

module.exports = Todo;
module.exports.model = require('./model');
