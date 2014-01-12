var request = require('request');
var assert = require('assert');
var host = 'http://localhost:3000';
describe('Service test', function() {
  describe('/user end point', function() {
    it('should not authorize request without session_id header', function(done) {
      var request = require('request');
      var options = {
        url: host + '/user/1',
        headers: { Accept: 'application/json' }
      };

      request(options, function(error, res, body) {
        if (!error && res.statusCode == 200) {
          done('invalid status code, it should be 500');
        } else {
          assert.equal(res.statusCode, 500);
          assert.equal(body, '{"error": "Unauthorized request" }');
          done();
        }
      });
    });

    it('should retrieve tasks by user', function(done) {
      var request = require('request');
      var options = {
        url: host + '/user/1',
        headers: {
          Accept: 'application/json',
          'session-id': 123
        }
      };

      request(options, function(error, res, body) {
        if (!error && res.statusCode == 200) {
          assert.equal(typeof body, 'string');
          assert.equal(JSON.parse(body).length, 4);
          done();
        } else {
          done('incorrect statusCode');
        }
      });
    });
  });
});
