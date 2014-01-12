var express = require('express');
var request = require('supertest');
var assert = require('assert');
var q = require('q');
var Todo = require('../../index').Todo;
var initApp = function(mockDb) {
  var todo = new Todo(mockDb, '/');
  var app = express();
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(todo.getApp());
  return app;
};
describe('Unit tests', function() {
  describe('Todo module', function() {
    describe('get', function() {
      it('200 get a list of tasks', function(done) {
        var fakeDb = {
          get: function(id) {
            var deferred = q.defer();
            if (id == 1) {
              deferred.resolve([
                {user_id: 1, title: 'one', body: 'one'}
              ]);
            } else {
              deferred.resolve([
                {user_id: 2, title: 'one', body: 'one'}
              ]);
            }
            return deferred.promise;
          }
        };

        var app = initApp(fakeDb);
        request(app).get('/user/1')
          .expect(200)
          .end(function(err, res) {
              if (err) {
                done(err);
              } else {
                var tasks = JSON.parse(res.text);
                assert.equal(tasks.length, 1);
                assert.equal(tasks[0].title, 'one');
                done();
              }
            });
      });
      it('500 code when error returned from db', function(done) {
        var fakeDb = {
          get: function() {
            var deferred = q.defer();
            deferred.reject({err: 'something wrong'});
            return deferred.promise;
          }
        };
        var app = initApp(fakeDb);
        request(app).get('/user/1')
          .expect(500)
          .end(function(err, res) {
              done();
            });

      });
    });

    describe('add', function() {
      it('should add a task', function(done) {
        var fakeDb = {
          add: function() {
            var deferred = q.defer();
            deferred.resolve({user_id: 2, title: 'two', body: 'two'});
            return deferred.promise;
          }
        };
        var app = initApp(fakeDb);
        request(app).post('/todo')
          .send('{"user_id":2, "title": "two", "body":"two" }')
          .expect(200)
          .end(function(err, res) {
              if (err) {
                done(err);
              } else {
                assert.equal(res.text, '{"user_id":2,"title":"two","body":"two"}');
                done();
              }
            });
      });


    it('should catch an error inserting a task, code 500', function(done) {
      var fakeDb = {
        add: function() {
          var deferred = q.defer();
          deferred.reject({error: 'db died'});
          return deferred.promise;
        }
      };
      var app = initApp(fakeDb);
      request(app).post('/todo')
        .send('{"user_id":2, "title": "two", "body":"two" }')
        .expect(500)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert.equal(res.text, '{"error": "Error inserting new task"}');
            done();
          }
        });
      });
    });

    it('should return error if malformed JSON is sent, code 500', function(done) {
      var fakeDb = {
        add: function() {
          var deferred = q.defer();
          deferred.reject({error: 'db died'});
          return deferred.promise;
        }
      };
      var app = initApp(fakeDb);
      request(app).post('/todo')
        .send('{"user_id":2, "title": "two", "body":"two" }')
        .expect(500)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            assert.equal(res.text, '{"error": "Error inserting new task"}');
            done();
          }
        });
      });

    describe('del', function() {
      it('should delete a task, code 200', function(done) {
        var fakeDb = {
          del: function() {
            var deferred = q.defer();
            deferred.resolve({user_id: 1, title: 'one', body: 'one'});
            return deferred.promise;
          }
        };
        var app = initApp(fakeDb);
        request(app).del('/todo/52c94497ced5af0000f1978f')
          .expect(200)
          .end(function(err, res) {
            if (err) {
              done(err);
            } else {
              assert.equal(res.text, '{"user_id":1,"title":"one","body":"one"}');
              done();
            }
          });
        });
      it('should catch an error when deleting a task, code 500', function(done) {
        var fakeDb = {
          del: function() {
            var deferred = q.defer();
            deferred.reject({error: 'something wrong'});
            return deferred.promise;
          }
        };
        var app = initApp(fakeDb);
        request(app).del('/todo/52c94497ced5af0000f1978f')
          .expect(500)
          .end(function(err, res) {
            if (err) {
              done(err);
            } else {
              assert.equal(JSON.parse(res.text).error, 'Error while deleting a task');
              done();
            }
          });
      });
    });
  });
});
