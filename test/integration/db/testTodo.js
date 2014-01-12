'use strict';
var assert = require('assert');
var Mocks = require('../mocks');
var mongoose = require('mongoose');
var mocks;
var TodoDb = require('../../../index').Todo.db;
var tododb;
var debug = require('debug')('todo-test-db');
var MONGO_DELAY = 100;
describe('Integration test', function() {

  before(function(done) {
    mongoose.connect('mongodb://localhost/todo');
    mongoose.connection.once('open', function() {
      tododb = new TodoDb(mongoose.connection);
      mocks = new Mocks(mongoose.connection);
      mocks.cleanUp(function() {
        done();
      });
    });
  });

  beforeEach(function(done) {
    mocks.cleanUp(function(err) {
        if(err) {
          debug(err);
          done(err);
        } else {
          setTimeout(function(){
            done();
          }, MONGO_DELAY);
        }
    });
  });

  describe('db/Todo', function() {
    describe('get', function() {
      it('return empty array if no data', function() {
          tododb.get(99).then(function(tasks) {
            assert.equal(Array.isArray(tasks), true);
            assert.equal(tasks.length, 0);
          }).done();
      });

      it('return an array of tasks', function() {
        tododb.get().then(function(tasks) {
          assert.equal(Array.isArray(tasks), true);
          assert.equal(tasks.length, 8);
        }).done();
      });

      it('should be posible to filter by user_id', function() {
        tododb.get(1).then(function(tasks) {
          assert.equal(Array.isArray(tasks), true);
          assert.equal(tasks.length, 4);
        }).done();
      });
    });

    describe('add', function() {
      it.skip('adds a task to the task list', function() {
        setTimeout(function() {
          tododb.add({ user_id: 1, title: 'additional', body: 'adfad'})
          .then(function() {
            return tododb.get();
          })
          .then(function(tasks) {
            assert.equal(tasks.length, 9);
            assert.equal(tasks[8].title, 'additional');
          }).done();
        }, 100);
      });

      it.skip('returns rejects the promise if operation fails', function() {
        tododb.add('non valid input').
        then(function() {
          //never gets here
        }, function(err) {
          assert.equal(typeof err, 'object');
        }).done();

        });
    });

    describe('delete', function() {
      it('deletes a task from the list', function() {
        tododb.get().then(function(tasks) {
          tododb.del(tasks[0]._id.toString()).then(function() {
            assert.equal(tasks.length, 8);
          }).done();
        }).done();
      });

      it('returns rejects the promise if operation fails', function() {
        tododb.get().then(function(tasks) {
          tododb.del(tasks[0]._id).then(function() {
            assert.equal(tasks.length, 8);
          }, function(err) {
            assert.equal(typeof err, 'object');
          }).done();
        }).done();
      });
    });

    describe('update', function() {
      it('shoul update a task', function() {
      });

      it('hsould reject the promise when failing', function() {
      });
    });
  });
});
