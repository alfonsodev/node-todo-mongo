'use strict';
var mongoose = require('mongoose');
var async = require('async');
var debug = require('debug')('todo');
var mockTasks1 = [
	{ user_id: 1, title: 'task 1 user 1', body: 'task 1' },
	{ user_id: 1, title: 'task 3 user 1', body: 'task 3' },
	{ user_id: 1, title: 'task 2 user 1', body: 'tas 2' },
	{ user_id: 1, title: 'task4 user 1', body: 'task 4' },
	{ user_id: 2, title: 'task1 user 2', body: 'task 1' },
	{ user_id: 2, title: 'task2 user 2', body: 'task 2' },
	{ user_id: 2, title: 'task3 user 2', body: 'task 3' },
	{ user_id: 2, title: 'task4 user 2', body: 'task 4' }
];
var Task = require('../../../index').Todo.db.model;

var Mocks = function(conn) {
	this.conn = conn;
};
Mocks.prototype.insert = function(docs, callback) {
//	var task = new Task();
	Task.create(docs, function(err, newTask) {
		if(err) {
			callback(error);
		} else {
			callback(newTask);
		}
	});
};

Mocks.prototype.empty = function(callback) {
	this.conn.collections['tasks'].drop(function(err) {
		if(err)	callback(err)
		callback();
	});
};
//recreate the databse
Mocks.prototype.cleanUp = function(callback) {
	var self = this;
	this.empty(function(err) {
		if(err){
			callback(err);
		} else {
			self.insert(mockTasks1, function(docs) {
				callback();
			});
		}
	});
};
module.exports = Mocks;
